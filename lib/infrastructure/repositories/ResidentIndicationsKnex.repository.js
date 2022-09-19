const _ = require('ramda');
const { knex } = require('../db/knex');

const Table = () => knex('resident_indications');

module.exports = {
  persist: (data) => Table()
    .insert(data),

  getLatestsByDateBetween: (from, to) => knex.raw(`
  SELECT * 
  FROM   (SELECT NAME, 
                 date, 
                 value, 
                 resident_id,
                 service_name, 
                 Row_number () 
                   OVER ( 
                     partition BY NAME 
                     ORDER BY created_at DESC ) AS rn 
          FROM   resident_indications 
          WHERE  date BETWEEN ? AND ?) AS t 
  WHERE  t.rn = 1;`, [from, to])
    .then(_.prop('rows')),
};
