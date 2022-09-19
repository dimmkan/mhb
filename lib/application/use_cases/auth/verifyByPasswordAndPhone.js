const { AppError, errorCodes } = require('shared/errors');

const verifyByPasswordAndPhone = async ({ hashManager, userRepository }, phone, password) => {
  const user = await userRepository.getByPhone(phone);
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS,
      { description: 'Phone not registered' },
    );
  }

  const isValid = await hashManager.compare(password, user.password);
  if (!isValid) {
    throw new AppError(
      errorCodes.INVALID_PASSWORD,
      { description: 'Invalid password' },
    );
  }

  user.password = undefined;
  return user;
};

module.exports = verifyByPasswordAndPhone;
