const first = require('shared/utils/helper/first');
const throwIs = require('shared/utils/helper/throwIs');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const { knex } = require('../db/knex');

const Table = () => knex('eds_profile');

module.exports = {
  upsert: (data) => Table()
    .insert(data)
    .onConflict(['edsId'])
    .merge()
    .returning('*')
    .then(first),

  getByUserId: (userId) => Table()
    .where('userId', userId)
    .select('edsId')
    .limit(1)
    .first()
    .then(throwIs(isEmptyOrNull, 'Eds profile not found')),

  getByEdsId: (edsId) => Table()
    .where('edsId', edsId)
    .select('userId')
    .limit(1)
    .first(),

  getByEdsIds: (edsIds) => Table()
    .whereIn('edsId', edsIds)
    .select('userId'),

  delete: (id) => Table()
    .del()
    .where('id', id),
};
