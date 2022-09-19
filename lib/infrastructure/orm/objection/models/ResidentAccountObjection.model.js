const { Model } = require('objection');
const Address = require('./AddressObjection.model');

const TABLE = 'resident_account';
class ResidentAccount extends Model {
  static get tableName() {
    return TABLE;
  }

  static get idColumn() {
    return 'residentId';
  }

  static get relationMappings() {
    return {
      address: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: `${TABLE}.addressId`,
          to: 'address.id',
        },
      },
    };
  }
}

module.exports = ResidentAccount;
