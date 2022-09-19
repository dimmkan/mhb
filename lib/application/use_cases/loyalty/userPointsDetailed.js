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

const sortOps = _.sort((a, b) => {
  if (a.createdAt > b.createdAt) {
    return -1;
  } if (a.createdAt < b.createdAt) {
    return 1;
  }
  return 0;
});

const paginateOps = _.curry((page, limit, ops) => {
  const currentIndex = (page - 1) * limit;
  return {
    data: ops.slice(currentIndex, currentIndex + limit),
    metadata: {
      count: ops.length,
      pages: Math.ceil(ops.length / limit),
    },
  };
});

module.exports = async function userPointsDetailedUseCase(
  { loyaltyOperationsRepository, loyaltyManager },
  { userId, page, limit },
) {
  return loyaltyOperationsRepository.find({ userId, closed: false })
    .then(mergeByTransactionId)
    .then(sanitizeOps(loyaltyManager.types.all))
    .then(sortOps)
    .then(paginateOps(page, limit));
};
