const _ = require('ramda');
const knexTransacting = require('shared/utils/helper/knexTransacting');
const { knex } = require('../db/knex');

const Table = () => knex('loyalty_operations');

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

  merge: (findSpec, data) => Table()
    .where(findSpec)
    .update(data),

  userPointsGroupByAccount: (userId, trx) => knexTransacting(
    Table()
      .where('sq.points', '>', 0)
      .from(knex.raw(`(${Table()
        .where({ userId, closed: false })
        .select([
          'accountId',
          'account',
          knex.raw('(sum(debit) - sum(credit))::int as points'),
        ])
        .groupBy(['account', 'accountId'])}) as sq`))
      .orderBy(['account', 'points']),
    trx,
  ),

  userPointsByAccountId: (accountId, trx) => knexTransacting(
    Table()
      .where({ accountId, closed: false })
      .select(knex.raw('(sum(debit) - sum(credit))::int as points'))
      .groupBy('accountId')
      .limit(1)
      .first(),
    trx,
  ).then(_.compose(_.objOf('points'), _.propOr(0, 'points'))),

  userPoints: (userId, trx) => knexTransacting(
    Table()
      .where({ userId, closed: false })
      .select(knex.raw('(sum(debit) - sum(credit))::int as points'))
      .groupBy('userId')
      .limit(1)
      .first(),
    trx,
  ).then(_.compose(_.objOf('points'), _.propOr(0, 'points'))),

  filteredUsersActions: (filters, trx) => knexTransacting(
    Table()
      .select([
        'loyalty_operations.user_id',
        'users.phone',
        'users.email',
        'user_profile.full_name as full_name',
        knex.raw('sum(debit)::int as action_points'),
      ])
      .leftJoin('user_profile as user_profile', 'loyalty_operations.user_id', 'user_profile.user_id')
      .leftJoin('users as users', 'loyalty_operations.user_id', 'users.id')
      .groupBy([
        'loyaltyOperations.userId',
        'phone',
        'email',
        'fullName',
      ])
      .orderBy('actionPoints', 'desc')
      .modify((queryBuilder) => {
        if (filters.length) {
          const firstCondition = filters.shift();
          queryBuilder.where(firstCondition.field, firstCondition.condition, firstCondition.value);
          filters.forEach((item) => {
            queryBuilder.andWhere(item.field, item.condition, item.value);
          });
        }
      })
      .limit(100),
    trx,
  ),

  closeNonApproved: ({ expireInSeconds }) => Table()
    .whereRaw(`approved=false AND closed=false AND created_at 
    + INTERVAL '${expireInSeconds} seconds' 
    < CURRENT_TIMESTAMP`)
    .update({ closed: true }),

};
