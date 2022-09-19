const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'loyalty_invitations';
const USER_ID_REFERENCE_TABLE = 'users';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));
    t.integer('beneficiary')
      .unsigned()
      .references(`${USER_ID_REFERENCE_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.string('hash');
    t.string('type');
    t.string('source_id');
    t.datetime('expiration_date');
    t.unique(['type', 'source_id', 'beneficiary']);
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
