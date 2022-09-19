const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'refresh_tokens';
const USER_ID_REFERENCE_TABLE = 'users';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');

    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references(`${USER_ID_REFERENCE_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    t.string('key').notNullable();
    t.timestamp('expires').notNullable();
    t.string('created_by_ip');
    t.timestamp('revoked');
    t.string('revoked_by_ip');
    t.string('replaced_by_token');
    t.string('agent');
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
