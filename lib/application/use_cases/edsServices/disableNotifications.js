const { AppError, errorCodes } = require('shared/errors');

const disableNotifications = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId,
}) => {
  try {
    const { edsServicesId } = await edsServicesProfileRepository.getByUserId(userId);
    await edsServicesExternal.setProfileNotificationsStatus({
      profileId: edsServicesId,
      status: false,
    });
    return true;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = disableNotifications;
