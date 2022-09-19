const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'user_notifications';
const NOTIFICATION_TABLE = 'notification';
const USERS_TABLE = 'users';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.boolean('is_read').notNullable().defaultTo(false);
    t.string('type').notNullable();
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references(`${USERS_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('notification_id')
      .unsigned()
      .notNullable()
      .references(`${NOTIFICATION_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
