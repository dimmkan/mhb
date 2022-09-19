const { customAlphabet } = require('nanoid');
const parseDuration = require('parse-duration');
const env = require('infrastructure/config/env');
const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_EMAIL_TYPES = require('shared/entities/confirmationEmailTypes');

const t = {
  title: 'Код:',
  change_email: 'Изменение адреса электронной почты',
};

const EXPIRES_IN_SEC = parseDuration(env.EXPIRE_CONFIRMED, 's');
const generateToken = customAlphabet(env.ALPHABET_CONFIRMED, env.TOKEN_LENGTH_CONFIRMED);

const changeEmailRequest = async (
  { confirmationTokenRepository, emailExternal, userRepository },
  {
    userId,
    email,
  },
) => {
  if (await userRepository.emailExist(email)) {
    throw new AppError(errorCodes.EMAIL_ALREADY_TAKEN);
  }

  const token = generateToken();
  const tokenObject = await confirmationTokenRepository.upsertByTargetIfExpire(
    { expiresIn: EXPIRES_IN_SEC },
    {
      target: userId,
      type: CONFIRMATION_EMAIL_TYPES.changeEmail,
      token,
      payload: { email },
    },
  );

  if (!tokenObject) {
    throw new AppError(errorCodes.TOO_MANY_REQUESTS);
  }

  try {
    await emailExternal.send(
      email,
      `${t.title} ${token}`,
      t[CONFIRMATION_EMAIL_TYPES.changeEmail],
    );
  } catch (e) {
    await confirmationTokenRepository.deleteById(tokenObject.id);
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = changeEmailRequest;
