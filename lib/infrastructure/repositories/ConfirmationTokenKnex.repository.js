const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const tableName = 'confirmation_token';
const Table = () => knex(tableName);

const isExpiresInSQL = (seconds) => `"${tableName}".updated_at 
+ INTERVAL '${seconds} seconds' 
< CURRENT_TIMESTAMP`;

module.exports = {
  all: Table,

  findToken: (target, token, type) => Table()
    .where({ target, token, type })
    .limit(1)
    .first(),

  upsertByTargetIfExpire: (whereObject, data) => Table()
    .insert(data)
    .onConflict(['target', 'type'])
    .merge()
    .whereRaw(isExpiresInSQL(whereObject.expiresIn))
    .returning('*')
    .then(first),

  deleteByTarget: (target) => Table()
    .del()
    .where('target', target),

  deleteById: (id) => Table()
    .del()
    .where('id', id),

  deleteByExpiresIn: (expiresIn) => Table()
    .del()
    .whereRaw(isExpiresInSQL(expiresIn)),

};
