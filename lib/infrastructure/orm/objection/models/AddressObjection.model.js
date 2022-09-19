const { Model } = require('objection');

const TABLE = 'address';
class Address extends Model {
  static get tableName() {
    return TABLE;
  }
}

module.exports = Address;
