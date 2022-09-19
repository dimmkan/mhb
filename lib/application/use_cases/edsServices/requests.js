const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const requestsWithMeta = _.converge(
  _.mergeLeft,
  [
    _.compose(_.objOf('data'), _.values, _.omit(['pages'])),
    _.pick(['pages']),
  ],
);

const requests = async ({
  edsServicesExternal,
  edsServicesProfileRepository,
}, {
  userId, limit, page,
}) => {
  try {
    const { edsServicesId } = await edsServicesProfileRepository.getByUserId(userId);
    const requestsData = await edsServicesExternal.getRequests({
      profileId: edsServicesId,
      limit,
      page,
    });
    return requestsWithMeta(requestsData);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = requests;
