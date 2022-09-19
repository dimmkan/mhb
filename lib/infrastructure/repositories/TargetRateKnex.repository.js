const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const tableName = 'target_rate';
const Table = () => knex(tableName);

module.exports = {
  upsert: (data) => Table()
    .insert(data)
    .onConflict(['targetId', 'userId', 'sessionId'])
    .merge()
    .returning('*')
    .then(first),

  targetRate: ({ userId, targetId, sessionId }) => {
    const query = Table()
      .select(
        'targetId',
        knex.raw("CASE rate WHEN 1 THEN 'LIKE' WHEN -1 THEN 'DISLIKE' ELSE 'NEUTRAL' END as rate"),
      )
      .where(userId ? { userId } : { sessionId });

    const isArrayTargetIds = Array.isArray(targetId);
    query[isArrayTargetIds ? 'whereIn' : 'where']('targetId', targetId);
    if (!isArrayTargetIds) {
      query.limit(1).first();
    }

    return query;
  },

  targetRateValue: ({ userId, targetId, sessionId }) => {
    const query = knex
      .select(
        knex.raw('"s".rate'),
        knex.raw('"f".target_id'),
        knex.raw('SUM(("f".rate = 1) :: int) :: int AS likes'),
        knex.raw('SUM(("f".rate = -1) :: int) :: int AS dislikes'),
      ).from({ f: tableName })
      .groupBy(['f.target_id', 's.rate']);

    const isArrayTargetIds = Array.isArray(targetId);
    query[isArrayTargetIds ? 'whereIn' : 'where']('f.targetId', targetId);
    if (!isArrayTargetIds) {
      query.limit(1).first();
    }

    const subQuery = knex(tableName)
      .select(
        knex.raw('target_id'),
        knex.raw(`CASE "${tableName}"."rate" WHEN 1 THEN 'LIKE' WHEN -1 THEN 'DISLIKE' ELSE 'NEUTRAL' END as rate`),
      ).groupBy(['target_id', 'rate'])
      .where(userId ? { userId } : { sessionId });

    return query
      .leftJoin(
        knex.raw(`(${subQuery}) as "s"`),
        's.targetId',
        'f.targetId',
      );
  },

  allCounts: () => knex
    .select(
      knex.raw('"f".target_id'),
      knex.raw('SUM(("f".rate = 1) :: int) :: int AS likes'),
      knex.raw('SUM(("f".rate = -1) :: int) :: int AS dislikes'),
    ).from({ f: tableName })
    .groupBy(['f.target_id']),
};
