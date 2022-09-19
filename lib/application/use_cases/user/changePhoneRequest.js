const { customAlphabet } = require('nanoid');
const parseDuration = require('parse-duration');
const env = require('infrastructure/config/env');
const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_PHONE_TYPES = require('shared/entities/confirmationPhoneTypes');

const t = {
  title: 'Код:',
};

const EXPIRES_IN_SEC = parseDuration(env.EXPIRE_CONFIRMED, 's');
const generateToken = customAlphabet(env.ALPHABET_CONFIRMED, env.TOKEN_LENGTH_CONFIRMED);

const changePhone = async (
  { confirmationTokenRepository, userRepository, smsExternal },
  {
    userId,
    phone,
  },
) => {
  if (await userRepository.phoneExist(phone)) {
    throw new AppError(errorCodes.PHONE_ALREADY_TAKEN);
  }

  const token = generateToken();
  const tokenObject = await confirmationTokenRepository.upsertByTargetIfExpire(
    { expiresIn: EXPIRES_IN_SEC },
    {
      target: userId,
      type: CONFIRMATION_PHONE_TYPES.changePhone,
      token,
      payload: { phone },
    },
  );

  if (!tokenObject) {
    throw new AppError(errorCodes.TOO_MANY_REQUESTS);
  }

  try {
    await smsExternal.send(phone, `${t.title} ${token}`);
  } catch (e) {
    await confirmationTokenRepository.deleteById(tokenObject.id);
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = changePhone;
