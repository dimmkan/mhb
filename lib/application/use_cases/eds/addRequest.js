const { AppError, errorCodes } = require('shared/errors');

const addRequest = async (serviceLocator, data) => {
  try {
    const { edsExternal, edsProfileRepository } = serviceLocator;
    const { edsId } = await edsProfileRepository.getByUserId(data.userId);
    const sendingData = {
      user_id: edsId,
      ...data,
    };
    return edsExternal.createRequest(sendingData);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = addRequest;
