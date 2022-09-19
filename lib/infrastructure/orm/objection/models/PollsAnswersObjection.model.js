const { Model } = require('objection');
const Resident = require('./ResidentAccountObjection.model');
const User = require('./UserObjection.model');

const TABLE = 'polls_answers';
class PollsAnswers extends Model {
  static get tableName() {
    return TABLE;
  }

  static get relationMappings() {
    return {

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

module.exports = PollsAnswers;
