const { Model } = require('objection');
const knex = require('infrastructure/db/knex');
const { AppError, errorCodes } = require('shared/errors');

module.exports = {
  run: async () => {
    try {
      await Model.knex(await knex.sync());
    } catch (e) {
      throw new AppError(errorCodes.DB, {
        origin: e,
        description: e.description,
        message: e.message,
      });
    }
  },
};
