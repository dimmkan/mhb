const { v4: uuidv4 } = require('uuid');

module.exports = async function onceDebitUseCase({
  loyaltyOperationsRepository,
  loyaltyHistoryRepository,
  logger,
}, {
  id: operationId,
  transactionId = uuidv4(),
  userId,
  source,
  sourceId,
  amount,
  account,
  accountId,
  approved = true,
  type,
  fingerprint,
}) {
  try {
    await loyaltyHistoryRepository.persist({ fingerprint: `${type}:${fingerprint}` });
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
  } catch (e) {
    logger.warn(
      e,
      {
        input: {
          id: operationId,
          transactionId,
          userId,
          source,
          sourceId,
          amount,
          account,
          accountId,
          approved,
          type,
          fingerprint,
        },
        type: 'loyalty.onceDebit',
      },
    );
    return false;
  }
};
