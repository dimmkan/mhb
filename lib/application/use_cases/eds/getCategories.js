const { AppError, errorCodes } = require('shared/errors');

const getCategories = async (serviceLocator) => {
  const { edsExternal } = serviceLocator;
  try {
    return edsExternal.getCategories();
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = getCategories;
