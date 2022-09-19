const { AppError, errorCodes } = require('shared/errors');
const { v4: uuidv4 } = require('uuid');

module.exports = async function debitUseCase({ loyaltyOperationsRepository }, {
  operationId,
  transactionId = uuidv4(),
  userId,
  source,
  sourceId,
  amount,
  type,
  account,
  accountId,
  approved = true,
}) {
  await loyaltyOperationsRepository.persist(
    {
      userId,
      source,
      sourceId,
      operationId,
      transactionId,
      approved,
      type,
      debit: amount,
      account,
      accountId,
    },
  );
  return true;
};
