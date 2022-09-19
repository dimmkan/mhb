const knex = require('knex');
const { knexSnakeCaseMappers } = require('objection');

const mode = require('./knexfile')[process.env.NODE_ENV || 'development'];

const connection = knex({
  ...mode,
  ...knexSnakeCaseMappers(),
});

module.exports = {
  knex: connection,
  sync: async () => {
    await connection.raw('SELECT 1');
    return connection;
  },
};
