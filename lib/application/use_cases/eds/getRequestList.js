const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const getRequestList = async (serviceLocator, data) => {
  try {
    const { edsExternal, edsProfileRepository } = serviceLocator;
    const { edsId } = await edsProfileRepository.getByUserId(data.id);
    const sendingData = {
      profileId: edsId,
      page: data.page,
      nPageSize: data.limit,
    };

    const result = await edsExternal.getRequestList(sendingData);
    return { data: _.values(_.omit(['pages'], result)), ..._.pick(['pages'], result) };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = getRequestList;
