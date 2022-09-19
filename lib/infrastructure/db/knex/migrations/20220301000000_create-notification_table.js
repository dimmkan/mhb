const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'notification';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.string('title').notNullable();
    t.string('body').notNullable();
    t.jsonb('payload');
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
