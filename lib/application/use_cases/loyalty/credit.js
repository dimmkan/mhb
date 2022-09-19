const { AppError, errorCodes } = require('shared/errors');
const { v4: uuidv4 } = require('uuid');
const _ = require('ramda');

module.exports = async function creditUseCase({ loyaltyOperationsRepository }, {
  operationId,
  transactionId = uuidv4(),
  userId,
  source,
  sourceId,
  amount,
  type,
  approved = true,
}) {
  const trx = await loyaltyOperationsRepository.transaction();
  try {
    const { points: userPoints } = await loyaltyOperationsRepository.userPoints(
      userId,
      trx,
    );
    if (amount > userPoints) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User dont have enough points!', descriptionRu: 'У пользователя недостаточно баллов!' });

    const pointsOperations = await loyaltyOperationsRepository.userPointsGroupByAccount(
      userId,
      trx,
    );

    const loyaltyOp = (op, isFirst) => ({
      userId,
      source,
      sourceId,
      operationId: isFirst ? operationId : null,
      transactionId,
      approved,
      type,
      credit: op.credit,
      account: op.account,
      accountId: op.accountId,
    });

    const creditOps = pointsOperations.reduce((acc, item, index) => {
      const reqCredit = amount - acc.reduce((sum, { credit }) => sum + credit, 0);
      return reqCredit
        ? acc.concat(loyaltyOp(item.points > reqCredit
          ? { ...item, credit: reqCredit }
          : { ...item, credit: item.points }, !index))
        : acc;
    }, []);

    await Promise.all(creditOps.map((op) => loyaltyOperationsRepository.persist(
      op,
      trx,
    )));

    await trx.commit();
    return true;
  } catch (e) {
    await trx.rollback();
    if (e instanceof AppError) throw e;
    if (_.propEq('constraint', 'loyalty_operations_operation_id_unique')) {
      throw new AppError(errorCodes.BAD_REQUEST, { description: 'ID constraint' });
    }
    throw new AppError(errorCodes.SERVER);
  }
};
