const { errorCodes, AppError } = require('shared/errors');
const CONFIRMATION_PHONE_TYPES = require('shared/entities/confirmationPhoneTypes');

const registration = async (
  dependencies,
  {
    phone,
    code,
  },
) => {
  const {
    confirmationTokenRepository,
    userRepository,
    loyaltyManager,
    logger,
  } = dependencies;

  const confirmObject = await confirmationTokenRepository.findToken(
    phone,
    code,
    CONFIRMATION_PHONE_TYPES.registration,
  );

  if (!confirmObject) throw new AppError(errorCodes.WRONG_SMS_CONFIRM_TOKEN);

  const {
    id: tokenId,
    payload: {
      email, password, fullName, residentId,
    },
  } = confirmObject;

  if (await userRepository.emailExist(email)) {
    throw new AppError(errorCodes.EMAIL_ALREADY_TAKEN);
  }

  if (await userRepository.phoneExist(phone)) {
    throw new AppError(errorCodes.PHONE_ALREADY_TAKEN);
  }

  const { id: userId } = await userRepository.persist({
    phone,
    email,
    password,
    profile: { fullName },
    phoneConfirmed: true,
    confirmed: true,
  });

  await confirmationTokenRepository.deleteById(tokenId);

  await loyaltyManager.debit(dependencies, {
    userId,
    ...loyaltyManager.types.user.REGISTRATION,
  }).catch((e) => {
    logger.warn(
      e,
      {
        input: {
          userId,
          ...loyaltyManager.types.user.REGISTRATION,
        },
        type: 'loyaltyManager.auth.registration',
      },
    );
  });

  return {
    userId, residentId, phone, email, fullName,
  };
};

module.exports = registration;
