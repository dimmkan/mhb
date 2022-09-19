const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

module.exports = async function pointsExternalUseCase(dependencies, filter) {
  const {
    loyaltyOperationsRepository,
    edsServicesProfileRepository,
  } = dependencies;

  if ('residentId' in filter && 'edsProfileId' in filter) {
    throw new AppError(errorCodes.BAD_REQUEST);
  }

  if ('residentId' in filter) {
    return loyaltyOperationsRepository.userPointsByAccountId(filter.residentId);
  }
  if ('edsProfileId' in filter) {
    return edsServicesProfileRepository.getByEdsServicesId(filter.edsProfileId)
      .then(_.prop('userId'))
      .then(_.tap((v) => { if (!v) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' }); }))
      .then((userId) => loyaltyOperationsRepository.userPoints(userId));
  }

  throw new AppError(errorCodes.BAD_REQUEST);
};
