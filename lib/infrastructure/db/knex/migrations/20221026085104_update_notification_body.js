const TABLE = 'notification';

exports.up = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.text('body')
      .notNullable()
      .alter();
  },
);

exports.down = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.string('body')
      .notNullable()
      .alter();
  },
);
