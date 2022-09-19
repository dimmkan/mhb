const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const Table = () => knex('refresh_tokens');

module.exports = {

  persist: (data) => Table()
    .insert(data)
    .returning('*')
    .then(first),

  merge: (data) => Table()
    .where('id', data.id)
    .update(data)
    .returning('*')
    .then(first),

  delete: (id) => Table()
    .del()
    .where('id', id),

  findByKey: (key) => Table()
    .where('key', key)
    .limit(1)
    .first(),

  deleteByIdAndUserId: (id, userId) => Table()
    .del()
    .where({ id, userId }),

  deleteAllByUserId: (userId) => Table()
    .del()
    .where('userId', userId),

};
