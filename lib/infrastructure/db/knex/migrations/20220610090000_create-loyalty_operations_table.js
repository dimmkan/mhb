const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'loyalty_operations';
const USER_ID_REFERENCE_TABLE = 'users';

exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references(`${USER_ID_REFERENCE_TABLE}.id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    t.uuid('transaction_id')
      .notNullable();

    t.uuid('operation_id')
      .defaultTo(knex.raw('gen_random_uuid()'))
      .unique();

    t.enum('source', ['main', 'eds', 'nedolzhnik']);
    t.string('source_id');

    t.enum('account', ['eds', 'nedolzhnik']);
    t.string('account_id');

    t.integer('debit')
      .unsigned()
      .defaultTo(0)
      .notNullable();

    t.integer('credit')
      .unsigned()
      .defaultTo(0)
      .notNullable();

    t.string('type')
      .notNullable();

    t.boolean('approved')
      .notNullable();

    t.boolean('closed')
      .notNullable()
      .defaultTo(false);

    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
