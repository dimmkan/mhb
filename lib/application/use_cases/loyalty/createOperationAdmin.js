const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const getTransactionType = (types, type) => {
  if ([types.ADMIN_CREDIT].map(_.prop('type')).includes(type)) return 'credit';
  if ([
    types.GK_LOCAL_EVENT,
    types.GOOD_DEEDS_EVENT,
    types.MANAGEMENT_COMPANY_REVIEW,
    types.EMPLOYEE_EVENT,
    types.ADMIN_DEBIT,
  ].map(_.prop('type')).includes(type)) return 'debit';
  throw new AppError(errorCodes.BAD_REQUEST);
};

module.exports = async function createOperationUseCase(
  dependencies,
  {
    amount,
    type,
    userId,
  },
) {
  const { loyaltyManager, userRepository } = dependencies;

  const user = await userRepository.get(userId, { user: 'id' });
  if (!user) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User not found!', descriptionRu: 'Пользователь с таким ID не найден!' });

  const operationAmount = loyaltyManager.types.admin[type].amount || amount;
  if (!operationAmount) throw new AppError(errorCodes.BAD_REQUEST, { description: 'Empty amount value' });

  const operationPayload = {
    type,
    amount: operationAmount,
    userId,
  };

  const transactionType = getTransactionType(loyaltyManager.types.admin, type);

  const { operationId } = (transactionType === 'debit')
    ? await loyaltyManager.debit(dependencies, operationPayload)
    : await loyaltyManager.credit(dependencies, operationPayload);

  return { operationId };
};
