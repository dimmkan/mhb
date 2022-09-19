const { knex } = require('../db/knex');

const Table = () => knex('users');

module.exports = {
  getUserList: () => Table()
    .select(['users.id',
      'users.phone',
      'users.email',
      'user_profile.full_name as full_name'])
    .leftJoin('user_profile as user_profile', 'users.id', 'user_profile.user_id')
    .orderBy('users.id'),
};
