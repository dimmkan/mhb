const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');
const { v4: uuidv4 } = require('uuid');

module.exports = async function debitUseCase({ loyaltyOperationsRepository, logger }, {
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
  try {
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
          type,
          account,
          accountId,
          approved,
        },
        type: 'loyalty.debit',
      },
    );
    if (e instanceof AppError) throw e;
    if (_.propEq('constraint', 'loyalty_operations_operation_id_unique')) {
      throw new AppError(errorCodes.BAD_REQUEST, { description: 'ID constraint' });
    }
    throw new AppError(errorCodes.SERVER);
  }
};
