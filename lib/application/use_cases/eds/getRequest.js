const { AppError, errorCodes } = require('shared/errors');

const getRequest = async (serviceLocator, requestId) => {
  const { edsExternal } = serviceLocator;
  try {
    return edsExternal.getRequest(requestId);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = getRequest;
