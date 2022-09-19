const { AppError, errorCodes } = require('shared/errors');

module.exports = async function verifyUniquePhoneOrEmail(
  { userRepository },
  { phone, email },
) {
  if (await userRepository.phoneExist(phone)) {
    throw new AppError(errorCodes.PHONE_ALREADY_TAKEN);
  }
  if (await userRepository.emailExist(email)) {
    throw new AppError(errorCodes.EMAIL_ALREADY_TAKEN);
  }
  return true;
};
