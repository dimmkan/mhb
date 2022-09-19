const { AppError, errorCodes } = require('shared/errors');

const createProfile = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
  cmsExternal,
}, {
  phone, fullName, email, userId, address,
}) => {
  try {
    const profileId = await edsServicesExternal.createProfile({
      fullName,
      email,
      phone: phone.slice(1),
      address,
    })
      .catch(async () => {
        await cmsExternal.logEdsServiceRegisterError({ phone, fullName, email });
      });
    const edsProfile = await edsServicesProfileRepository.upsert({
      userId,
      edsServicesId: profileId,
    });
    return edsProfile;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = createProfile;
