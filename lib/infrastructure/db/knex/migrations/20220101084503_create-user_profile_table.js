const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'user_profile';
const USER_ID_REFERENCE_TABLE = 'users';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.integer('user_id')
      .primary()
      .unsigned()
      .notNullable()
      .references(`${USER_ID_REFERENCE_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    t.boolean('confirmed').notNullable().defaultTo(false);
    t.string('full_name').notNullable();
    t.enum('sex', ['female', 'male']);
    t.string('birthday');

    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
