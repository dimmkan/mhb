const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

module.exports = async function createOperationUseCase(
  { loyaltyOperationsRepository },
  { id: operationId },
) {
  const op = await loyaltyOperationsRepository.find({ operationId })
    .then(_.tap((r) => { if (!r) throw new AppError(errorCodes.BAD_REQUEST); }))
    .then(_.head);

  const ops = await loyaltyOperationsRepository.merge(
    { transactionId: op.transactionId },
    { closed: true },
  );

  return true;
};
