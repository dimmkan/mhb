const TABLE = 'resident_indications';

exports.up = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.decimal('value', 20, 5)
      .unsigned()
      .notNullable()
      .alter();
  },
);

exports.down = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.integer('value')
      .unsigned()
      .notNullable()
      .alter();
  },
);
