const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'eds_services_profile';
const USER_TABLE = 'users';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.integer('eds_services_id')
      .unsigned()
      .notNullable()
      .unique();
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .unique()
      .references(`${USER_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
