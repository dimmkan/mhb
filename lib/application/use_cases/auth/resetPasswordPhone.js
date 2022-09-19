const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_PHONE_TYPES = require('shared/entities/confirmationPhoneTypes');

const resetPasswordPhone = async (
  {
    userRepository,
    confirmationTokenRepository,
  },
  {
    phone,
    code,
  },
) => {
  const user = await userRepository.getByPhone(phone);
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS,
      { description: 'Email not registered' },
    );
  }

  const confirmObject = await confirmationTokenRepository
    .findToken(
      `${user.id}:${phone}`,
      code,
      CONFIRMATION_PHONE_TYPES.resetPasswordSms,
    );

  if (!confirmObject) throw new AppError(errorCodes.WRONG_SMS_CONFIRM_TOKEN);

  await userRepository.merge({
    id: user.id,
    password: confirmObject.payload.password,
  });

  await confirmationTokenRepository.deleteById(confirmObject.id);

  return true;
};

module.exports = resetPasswordPhone;
