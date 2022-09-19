const { Model } = require('objection');
const UserProfileModel = require('./UserProfileObjection.model');

const TABLE = 'users';
class User extends Model {
  static get tableName() {
    return TABLE;
  }

  static get relationMappings() {
    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: UserProfileModel,
        join: {
          from: `${TABLE}.id`,
          to: 'user_profile.userId',
        },
      },

    };
  }
}

module.exports = User;
