const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_EMAIL_TYPES = require('shared/entities/confirmationEmailTypes');

const resetPasswordEmail = async (
  {
    userRepository,
    confirmationTokenRepository,
  },
  {
    email,
    code,
  },
) => {
  const user = await userRepository.getByEmail(email);
  if (!user) {
    throw new AppError(
      errorCodes.INVALID_CREDENTIALS,
      { description: 'Email not registered' },
    );
  }

  const confirmObject = await confirmationTokenRepository
    .findToken(
      `${user.id}:${email}`,
      code,
      CONFIRMATION_EMAIL_TYPES.resetPasswordEmail,
    );

  if (!confirmObject) throw new AppError(errorCodes.WRONG_EMAIL_CONFIRM_TOKEN);

  await userRepository.merge({
    id: user.id,
    password: confirmObject.payload.password,
  });

  await confirmationTokenRepository.deleteById(confirmObject.id);

  return true;
};

module.exports = resetPasswordEmail;
