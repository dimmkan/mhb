const { AppError, errorCodes } = require('shared/errors');

const request = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId, id: requestId,
}) => {
  try {
    await edsServicesProfileRepository.getByUserId(userId);
    const requestData = await edsServicesExternal.getRequest(requestId);
    return requestData;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = request;
