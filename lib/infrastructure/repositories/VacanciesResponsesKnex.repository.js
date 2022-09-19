const _ = require('ramda');
const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const Table = () => knex('vacancies_responses');

module.exports = {
  persist: (data) => Table()
    .insert(data)
    .returning('*')
    .then(first),

  findByUserId: (userId, vacancyId) => Table()
    .select('*')
    .where('userId', userId)
    .where('vacancyId', vacancyId),
};
