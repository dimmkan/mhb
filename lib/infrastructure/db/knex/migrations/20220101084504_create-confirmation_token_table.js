const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'confirmation_token';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.string('target').notNullable();
    t.enum('type', [
      'registration_sms',
      'reset_password_sms',
      'reset_password_email',
      'change_email',
      'change_phone',
    ]).notNullable();
    t.string('token').notNullable();
    t.jsonb('payload').notNullable();

    t.unique(['target', 'type']);
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
