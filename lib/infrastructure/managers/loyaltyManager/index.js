const creditUseCase = require('application/use_cases/loyalty/credit');
const debitUseCase = require('application/use_cases/loyalty/debit');
const onceDebitUseCase = require('application/use_cases/loyalty/onceDebit');
const types = require('./types');

module.exports = {
  debit: debitUseCase,
  onceDebit: onceDebitUseCase,
  credit: creditUseCase,
  types,
};
