const { AppError, errorCodes } = require('shared/errors');

const disableNotifications = async ({
  edsExternal,
  edsProfileRepository,
}, {
  userId,
}) => {
  try {
    const { edsId } = await edsProfileRepository.getByUserId(userId);
    await edsExternal.setProfileNotificationsStatus({
      profileId: edsId,
      status: false,
    });
    return true;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = disableNotifications;
