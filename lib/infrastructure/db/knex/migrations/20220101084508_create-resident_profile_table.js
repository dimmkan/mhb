const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'resident_profile';
const RESIDENT_ACCOUNT_REFERENCE_TABLE = 'resident_account';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.integer('parent_id').references(`${TABLE}.id`);
    t.boolean('confirmed').notNullable();
    t.integer('user_id').notNullable();

    t.string('resident_id')
      .unsigned()
      .notNullable()
      .references(`${RESIDENT_ACCOUNT_REFERENCE_TABLE}.resident_id`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    t.unique(['user_id', 'resident_id']);
    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
