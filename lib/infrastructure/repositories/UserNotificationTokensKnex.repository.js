const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const tableName = 'user_notification_tokens';
const Table = () => knex(tableName);

module.exports = {
  upsertFCMToken: (data) => Table()
    .insert(data)
    .onConflict('refresh_id')
    .merge()
    .returning('*')
    .then(first),

  getByUserId: (userId) => Table()
    .where('user_id', userId)
    .select('firebase_token')
    .groupBy('firebase_token'),

  getByUserIds: (userIds) => Table()
    .whereIn('user_id', userIds)
    .select('firebase_token')
    .groupBy('firebase_token'),

  getByRefreshId: (rId) => Table()
    .where('refresh_id', rId)
    .select('firebase_token')
    .limit(1)
    .first(),

  getIdByKey: (key) => Table()
    .where('firebase_token', key)
    .select('id'),

  remove: (ids) => Table()
    .del()
    .whereIn('id', ids),

};
