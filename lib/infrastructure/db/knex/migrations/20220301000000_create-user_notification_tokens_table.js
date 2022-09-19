const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'user_notification_tokens';
const USER_TABLE = 'users';
const REFRESH_TOKENS_TABLE = 'refresh_tokens';

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
    t.integer('refresh_id')
      .unsigned()
      .notNullable()
      .unique()
      .references(`${REFRESH_TOKENS_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.string('firebase_token').notNullable();
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
