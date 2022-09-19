const { AppError, errorCodes } = require('shared/errors');

const changePassword = async (
  { userRepository, hashManager },
  {
    userId,
    password,
    newPassword,
  },
) => {
  const user = await userRepository.get(userId);
  const isValid = await hashManager.compare(password, user.password);
  if (!isValid) {
    throw new AppError(
      errorCodes.INVALID_PASSWORD,
      { description: 'Invalid password' },
    );
  }

  await userRepository.merge({
    id: userId,
    password: await hashManager.hash(newPassword),
  });
};

module.exports = changePassword;
