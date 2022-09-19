const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_PHONE_TYPES = require('shared/entities/confirmationPhoneTypes');

const changePhoneRequest = async (
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
      CONFIRMATION_PHONE_TYPES.changePhone,
    );
  if (!confirmObject) throw new AppError(errorCodes.WRONG_SMS_CONFIRM_TOKEN);
  const { id: tokenId, payload: { phone } } = confirmObject;

  if (await userRepository.phoneExist(phone)) {
    throw new AppError(errorCodes.PHONE_ALREADY_TAKEN);
  }

  await userRepository.merge({
    id: userId,
    phone,
    phoneConfirmed: true,
  });

  await confirmationTokenRepository.deleteById(tokenId);
};

module.exports = changePhoneRequest;
