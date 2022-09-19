const { customAlphabet } = require('nanoid');
const parseDuration = require('parse-duration');
const env = require('infrastructure/config/env');
const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_EMAIL_TYPES = require('shared/entities/confirmationEmailTypes');

const t = {
  title: 'Код:',
  reset_password_email: 'Восстановление пароля',
};

const EXPIRES_IN_SEC = parseDuration(env.EXPIRE_CONFIRMED, 's');
const generateToken = customAlphabet(env.ALPHABET_CONFIRMED, env.TOKEN_LENGTH_CONFIRMED);

const resetPasswordEmailRequest = async (
  {
    emailExternal,
    userRepository,
    confirmationTokenRepository,
    hashManager,
  },
  {
    email,
    password,
  },
) => {
  const user = await userRepository.getByEmail(email);
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS,
      { description: 'Email not registered' },
    );
  }

  const token = generateToken();

  const tokenObject = await confirmationTokenRepository.upsertByTargetIfExpire(
    { expiresIn: EXPIRES_IN_SEC },
    {
      target: `${user.id}:${email}`,
      type: CONFIRMATION_EMAIL_TYPES.resetPasswordEmail,
      token,
      payload: { userId: user.id, password: await hashManager.hash(password) },
    },
  );

  if (!tokenObject) {
    throw new AppError(errorCodes.TOO_MANY_REQUESTS);
  }

  try {
    await emailExternal.send(
      email,
      `${t.title} ${token}`,
      t[CONFIRMATION_EMAIL_TYPES.resetPasswordEmail],
    );
  } catch (e) {
    await confirmationTokenRepository.deleteById(tokenObject.id);
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = resetPasswordEmailRequest;
