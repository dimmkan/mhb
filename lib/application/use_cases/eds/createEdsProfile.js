const { AppError, errorCodes } = require('shared/errors');

const createEdsProfile = async (serviceLocator, profileData) => {
  const {
    edsExternal,
    edsProfileRepository,
    logger,
  } = serviceLocator;
  const [lastName, firstName, patronymic] = profileData.fullName.split(' ');
  const data = {
    client_name: firstName || '',
    client_surname: lastName || '',
    client_middle: patronymic || '',
    client_email: profileData.email || '',
    client_phone: profileData.phone.includes('+') ? profileData.phone.slice(1) : profileData.phone,
    address: profileData.address,
  };

  const edsId = await edsExternal.createEdsAccount(data)
    .catch(async (error) => {
      const { cmsExternal } = serviceLocator;
      await cmsExternal.logEdsRegisterError(profileData);
      logger.warn(error, { type: 'tasks.createEDSProfile' });
    });
  try {
    const edsProfile = await edsProfileRepository
      .upsert({ userId: profileData.userId, edsId: +edsId });
    return edsProfile;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = createEdsProfile;
