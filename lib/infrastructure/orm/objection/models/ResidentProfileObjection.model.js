const { Model } = require('objection');
const Resident = require('./ResidentAccountObjection.model');
const User = require('./UserObjection.model');

const TABLE = 'resident_profile';
class ResidentProfile extends Model {
  static get tableName() {
    return TABLE;
  }

  static get relationMappings() {
    return {

      children: {
        relation: Model.HasManyRelation,
        modelClass: ResidentProfile,
        join: {
          from: `${TABLE}.id`,
          to: `${TABLE}.parentId`,
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${TABLE}.userId`,
          to: 'users.id',
        },
      },

      residentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Resident,
        join: {
          from: `${TABLE}.residentId`,
          to: 'resident_account.residentId',
        },
      },

    };
  }
}

module.exports = ResidentProfile;
