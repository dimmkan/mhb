const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_EMAIL_TYPES = require('shared/entities/confirmationEmailTypes');

const changeEmail = async (
  {
    confirmationTokenRepository,
    userRepository,
  },
  {
    userId,
    code,
  },
) => {
  const confirmObject = await confirmationTokenRepository
    .findToken(
      userId,
      code,
      CONFIRMATION_EMAIL_TYPES.changeEmail,
    );
  if (!confirmObject) throw new AppError(errorCodes.WRONG_SMS_CONFIRM_TOKEN);
  const { id: tokenId, payload: { email } } = confirmObject;

  if (await userRepository.emailExist(email)) {
    throw new AppError(errorCodes.EMAIL_ALREADY_TAKEN);
  }

  await userRepository.merge({
    id: userId,
    email,
    emailConfirmed: true,
  });

  await confirmationTokenRepository.deleteById(tokenId);
};

module.exports = changeEmail;
