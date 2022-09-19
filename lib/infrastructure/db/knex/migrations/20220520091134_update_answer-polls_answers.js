const TABLE = 'polls_answers';

exports.up = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.integer('answer')
      .notNullable()
      .alter();
  },
);

exports.down = (knex) => knex.schema.alterTable(
  TABLE,
  (t) => {
    t.jsonb('answer')
      .notNullable()
      .alter();
  },
);
