const postgresTimestampTrigger = require('shared/utils/helper/postgresTimestampTrigger');

const TABLE = 'address';
exports.up = (knex) => knex.schema.createTable(
  TABLE,
  (t) => {
    t.increments('id');
    t.string('source');
    t.string('result').unique();
    t.integer('qc');
    t.integer('fias_actuality_state');
    t.string('fias_id');

    t.string('region');
    t.string('region_type');

    t.string('city');
    t.string('city_type');

    t.string('city_district');
    t.string('city_district_type');

    t.string('street');
    t.string('street_type');

    t.string('house');
    t.string('house_type');

    t.string('settlement');
    t.string('settlement_type');

    t.string('block');
    t.string('block_type');

    t.string('flat');
    t.string('flat_type');

    t.timestamps(false, true);
  },
)
  .then(() => knex.raw(postgresTimestampTrigger(TABLE)));

exports.down = (knex) => knex.schema.dropTable(TABLE);
