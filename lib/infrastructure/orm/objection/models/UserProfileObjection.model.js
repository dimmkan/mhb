const { Model } = require('objection');

const TABLE = 'user_profile';
class UserProfile extends Model {
  static get tableName() {
    return TABLE;
  }

  static get idColumn() {
    return 'user_id';
  }
}

module.exports = UserProfile;
