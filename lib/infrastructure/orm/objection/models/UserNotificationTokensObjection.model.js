const { Model } = require('objection');
const User = require('./UserObjection.model');
const RefreshTokens = require('./RefreshTokensObjection.model');

const TABLE = 'user_notification_tokens';
class UserNotificationTokens extends Model {
  static get tableName() {
    return TABLE;
  }

  static get relationMappings() {
    return {
      userId: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${TABLE}.userId`,
          to: 'users.id',
        },
      },
      refreshId: {
        relation: Model.BelongsToOneRelation,
        modelClass: RefreshTokens,
        join: {
          from: `${TABLE}.refreshId`,
          to: 'refresh_tokens.id',
        },
      },
    };
  }
}

module.exports = UserNotificationTokens;
