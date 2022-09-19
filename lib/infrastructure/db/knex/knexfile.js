const {
  DB_DATABASE, DB_DIALECT, DB_PASSWORD, DB_USERNAME, DB_HOST,
} = require('infrastructure/config/env');

module.exports = {

  development: {
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      database: DB_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      database: DB_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      database: DB_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
