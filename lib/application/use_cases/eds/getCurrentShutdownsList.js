const { AppError, errorCodes } = require('shared/errors');

const getCurrentShutdownsList = async (serviceLocator, data) => {
  try {
    const { edsExternal, edsProfileRepository } = serviceLocator;
    const { edsId } = await edsProfileRepository.getByUserId(data.userId);

    return edsExternal.getCurrentShutdownsList(edsId);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = getCurrentShutdownsList;
