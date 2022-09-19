const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const tableName = 'target_views';
const Table = () => knex(tableName);

module.exports = {
  upsert: (data) => Table()
    .insert(data)
    .onConflict(['targetId', 'userId', 'sessionId'])
    .merge()
    .returning('*')
    .then(first),

  targetCounts: (targetId) => Table()
    .where('targetId', targetId)
    .count()
    .limit(1)
    .first(),

  allCounts: () => Table()
    .select(
      'targetId',
      knex.raw('count(*) :: int as views'),
    )
    .groupBy('targetId'),

  existTargets: ({ userId, targetIds, sessionId }) => Table()
    .select('targetId')
    .where(userId ? { userId } : { sessionId })
    .whereIn('targetId', targetIds),

  existTarget: ({ userId, targetId, sessionId }) => Table()
    .select('id')
    .where(userId ? { userId, targetId } : { targetId, sessionId })
    .limit(1)
    .first()
    .then(Boolean),
};
