const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const getAccount = (types, type) => {
  if ([types.EDS_SERVICE_PAYMENT].map(_.prop('type')).includes(type)) return 'eds';
  if ([types.NEDOLZHNIK_PAID].map(_.prop('type')).includes(type)) return 'nedolzhnik';
  throw new AppError(errorCodes.BAD_REQUEST);
};

const getTransactionType = (types, type) => {
  if ([types.EDS_SERVICE_PAYMENT].map(_.prop('type')).includes(type)) return 'credit';
  if ([types.NEDOLZHNIK_PAID].map(_.prop('type')).includes(type)) return 'debit';
  throw new AppError(errorCodes.BAD_REQUEST);
};

module.exports = async function createOperationUseCase(
  dependencies,
  {
    id: operationId,
    source,
    sourceId,
    amount,
    type,
    accountId,
  },
) {
  const {
    loyaltyManager,
    residentProfileRepository,
    edsServicesProfileRepository,
  } = dependencies;

  const account = getAccount(loyaltyManager.types.external, type);

  const userId = account === 'nedolzhnik'
    ? await residentProfileRepository.findParentByResidentId(accountId).then(_.prop('userId'))
    : await edsServicesProfileRepository.getByEdsServicesId(accountId).then(_.prop('userId'));

  if (!userId) throw new AppError(errorCodes.BAD_REQUEST, { description: 'Account ID not found!' });

  const transactionType = getTransactionType(loyaltyManager.types.external, type);
  const operationPayload = {
    userId,
    operationId,
    type,
    amount,
    source,
    sourceId,
    ...(account === 'nedolzhnik' && {
      account,
      accountId,
    }),
  };
  const loyaltyTransaction = (transactionType === 'debit')
    ? await loyaltyManager.debit(dependencies, operationPayload)
    : await loyaltyManager.credit(dependencies, operationPayload);

  return { operationId };
};
