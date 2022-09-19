const { AppError, errorCodes } = require('shared/errors');

const createRequest = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId, ...requestBody
}) => {
  try {
    const { edsServicesId } = await edsServicesProfileRepository.getByUserId(userId);
    const requestData = await edsServicesExternal.createRequest({
      ...requestBody,
      profileId: edsServicesId,
    });
    return requestData;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = createRequest;
