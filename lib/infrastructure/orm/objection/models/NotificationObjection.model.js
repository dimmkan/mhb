const { Model } = require('objection');

const TABLE = 'notification';
class Notification extends Model {
  static get tableName() {
    return TABLE;
  }
}

module.exports = Notification;
