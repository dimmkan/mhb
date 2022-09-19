const cron = require('node-cron');
const env = require('infrastructure/config/env');
const registrationRequestClearCache = require('application/use_cases/auth/registrationRequestClearCache');

module.exports = (dependencies) => env.REGISTRATION_REQUEST_CLEAR_CACHE_CRON_EXP && cron.schedule(
  env.REGISTRATION_REQUEST_CLEAR_CACHE_CRON_EXP,
  async () => {
    try {
      await registrationRequestClearCache(dependencies, { expiresInSeconds: 10 * 60 });
    } catch (e) {
      dependencies.logger.warn(e, { type: 'tasks.registrationRequestClearCache' });
    }
  },
);
