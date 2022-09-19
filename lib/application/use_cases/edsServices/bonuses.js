const { AppError, errorCodes } = require('shared/errors');

const bonuses = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId,
}) => {
  try {
    const { edsServicesId } = await edsServicesProfileRepository.getByUserId(userId);
    const bonusesData = await edsServicesExternal.getProfileBonuses({ profileId: edsServicesId });
    return bonusesData;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = bonuses;
