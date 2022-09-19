const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'loyalty_history';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));
    t.string('fingerprint').unique();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
