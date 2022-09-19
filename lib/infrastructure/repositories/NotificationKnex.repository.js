const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const Table = () => knex('notification');

module.exports = {
  persist: (data) => Table()
    .insert(data)
    .returning('*')
    .then(first),

  update: (id, data) => Table()
    .where('id', id)
    .update(data)
    .returning('*')
    .then(first),

  delete: (id) => Table()
    .del()
    .where('id', id),
};
