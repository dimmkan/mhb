const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'resident_account';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.string('resident_id').primary().unsigned().notNullable();
    t.integer('managing_company_id').unsigned().notNullable();
    t.integer('address_id').unsigned().notNullable();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
