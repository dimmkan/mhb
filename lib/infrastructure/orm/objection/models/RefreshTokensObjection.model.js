const { Model } = require('objection');

const TABLE = 'refresh_tokens';
class RefreshTokens extends Model {
  static get tableName() {
    return TABLE;
  }
}
module.exports = RefreshTokens;
