module.exports = (knexQuery, knexTrx) => (
  (knexTrx)
    ? knexQuery.transacting(knexTrx)
    : knexQuery
);
