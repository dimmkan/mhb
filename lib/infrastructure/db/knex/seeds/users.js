const HashManager = require('infrastructure/security/HashManager');

exports.seed = (knex) => knex('users')
  .del()
  .then(async () => knex('users')
    .insert([
      {
        phone: '+79651234567',
        email: 'example@mail.net',
        password: await HashManager.hash('password'),
      },
    ]));
