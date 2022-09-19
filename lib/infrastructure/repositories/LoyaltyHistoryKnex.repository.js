const knexTransacting = require('shared/utils/helper/knexTransacting');
const { knex } = require('../db/knex');

const Table = () => knex('loyalty_history');

module.exports = {
  transaction: () => knex.transaction(),

  persist: (data, trx) => knexTransacting(
    Table().insert(data),
    trx,
  ),

  find: (findSpec, trx) => knexTransacting(
    Table().where(findSpec),
    trx,
  ),
};
