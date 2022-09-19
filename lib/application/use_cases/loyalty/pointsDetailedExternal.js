const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const mergeByTransactionId = _.compose(
  _.values,
  _.map((ops) => ({
    ..._.head(ops),
    debit: ops.reduce((sum, { debit }) => sum + debit, 0),
    credit: ops.reduce((sum, { credit }) => sum + credit, 0),
  })),
  _.groupBy(_.prop('transactionId')),
);

const sanitizeOps = _.curry((types, ops) => ops.map((op) => {
  const {
    debit,
    credit,
    type,
    sourceId,
    createdAt,
  } = op;
  const { description } = types[type] || { description: '' };
  const typeOp = debit ? 'INCOME' : 'OUTCOME';
  const amount = debit || credit;
  return {
    description,
    type: typeOp,
    amount,
    sourceId: sourceId || '',
    createdAt,
  };
}));

module.exports = async function pointsDetailedExternalUseCase(dependencies, filter) {
  const {
    loyaltyOperationsRepository,
    edsServicesProfileRepository,
    loyaltyManager,
  } = dependencies;

  if ('residentId' in filter && 'edsProfileId' in filter) {
    throw new AppError(errorCodes.BAD_REQUEST);
  }

  if ('residentId' in filter) {
    return loyaltyOperationsRepository.find({ accountId: filter.residentId })
      .then(sanitizeOps(loyaltyManager.types.all));
  }
  if ('edsProfileId' in filter) {
    return edsServicesProfileRepository.getByEdsServicesId(filter.edsProfileId)
      .then(_.prop('userId'))
      .then(_.tap((v) => { if (!v) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' }); }))
      .then((userId) => loyaltyOperationsRepository.find({ userId, closed: false }))
      .then(mergeByTransactionId)
      .then(sanitizeOps(loyaltyManager.types.all));
  }

  throw new AppError(errorCodes.BAD_REQUEST);
};
