const knexTransacting = require('shared/utils/helper/knexTransacting');
const { knex } = require('../db/knex');

const Table = () => knex('loyalty_invitations');

module.exports = {
  transaction: () => knex.transaction(),

  persist: (data, trx) => knexTransacting(
    Table().insert(data).returning('*'),
    trx,
  ),

  find: (findSpec, trx) => knexTransacting(
    Table().where(findSpec),
    trx,
  ),

  deleteExpired: () => Table()
    .del()
    .whereRaw('expiration_date < CURRENT_TIMESTAMP'),

  getFilteredList: (filters, trx) => knexTransacting(
    Table()
      .modify((queryBuilder) => {
        if (filters.length) {
          const firstCondition = filters.shift();
          queryBuilder.where(firstCondition.field, firstCondition.condition, firstCondition.value);
          filters.forEach((item) => {
            queryBuilder.andWhere(item.field, item.condition, item.value);
          });
        }
      }),
    trx,
  ),
};
