const { AppError, errorCodes } = require('shared/errors');

const uploadImages = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId, files,
}) => {
  try {
    await edsServicesProfileRepository.getByUserId(userId);
    const images = await edsServicesExternal.uploadImages(files);
    return images;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = uploadImages;
