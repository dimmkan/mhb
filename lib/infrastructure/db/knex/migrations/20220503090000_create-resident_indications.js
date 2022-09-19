const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'resident_indications';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.string('resident_id')
      .notNullable();
    t.date('date')
      .notNullable();
    t.string('service_name')
      .notNullable();
    t.string('name')
      .notNullable();
    t.integer('value')
      .unsigned()
      .notNullable();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
