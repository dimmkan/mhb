const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'users';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.string('password', 255).notNullable();
    t.string('phone', 255).notNullable().unique();
    t.boolean('phone_confirmed').notNullable().defaultTo(false);
    t.string('email', 255).notNullable().unique();
    t.boolean('email_confirmed').notNullable().defaultTo(false);
    t.boolean('confirmed').notNullable().defaultTo(false);
    // t.string('role', 255).notNullable();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
