const first = require('shared/utils/helper/first');
const throwIs = require('shared/utils/helper/throwIs');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const { knex } = require('../db/knex');

const Table = () => knex('eds_services_profile');

module.exports = {
  upsert: (data) => Table()
    .insert(data)
    .onConflict('edsServicesId')
    .merge()
    .returning('*')
    .then(first),

  getByUserId: (userId) => Table()
    .where('userId', userId)
    .limit(1)
    .first()
    .then(throwIs(isEmptyOrNull, 'Eds services profile not found')),

  getByEdsServicesId: (edsServicesId) => Table()
    .where('edsServicesId', edsServicesId)
    .limit(1)
    .first(),

  delete: (id) => Table()
    .del()
    .where('id', id),
};
