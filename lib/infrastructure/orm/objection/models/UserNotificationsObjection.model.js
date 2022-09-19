const { Model } = require('objection');
const Notification = require('./NotificationObjection.model');

const TABLE = 'user_notifications';
class UserNotifications extends Model {
  static get tableName() {
    return TABLE;
  }

  static get relationMappings() {
    return {
      notification: {
        relation: Model.BelongsToOneRelation,
        modelClass: Notification,
        join: {
          from: `${TABLE}.notificationId`,
          to: 'notification.id',
        },
      },
    };
  }
}

module.exports = UserNotifications;
