const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'vacancies_responses';
const USER_TABLE = 'users';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references(`${USER_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('vacancy_id')
      .unsigned()
      .notNullable();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
