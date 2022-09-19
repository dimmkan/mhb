const { AppError, errorCodes } = require('shared/errors');

const uploadRequestImages = async (serviceLocator, { files }) => {
  const { edsExternal } = serviceLocator;
  const fileNamesArray = await edsExternal
    .sendFileToEds(Array.isArray(files) ? files : new Array(files));
  if (fileNamesArray.includes(undefined)) throw new AppError(errorCodes.PHOTO_NOT_UPLOAD, { description: `Фото ${fileNamesArray.indexOf(undefined) + 1} не загружено.` });
  return { fileNamesArray };
};

module.exports = uploadRequestImages;
