const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'polls_answers';
const USER_TABLE = 'users';
const RESIDENT_ACCOUNT_REFERENCE_TABLE = 'resident_account';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.integer('poll_id')
      .unsigned()
      .notNullable();
    t.jsonb('answer')
      .notNullable();
    t.string('resident_id')
      .unsigned()
      .notNullable()
      .references(`${RESIDENT_ACCOUNT_REFERENCE_TABLE}.resident_id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references(`${USER_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
