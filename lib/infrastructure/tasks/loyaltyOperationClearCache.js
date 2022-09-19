const cron = require('node-cron');
const env = require('infrastructure/config/env');
const createOperationClearCache = require('application/use_cases/loyalty/createOperationClearCache');

module.exports = (dependencies) => env.LOYALTY_OPERATION_CLEAR_CACHE_CRON_EXP && cron.schedule(
  env.LOYALTY_OPERATION_CLEAR_CACHE_CRON_EXP,
  async () => {
    try {
      await createOperationClearCache(dependencies, { expireInSeconds: 1800 });
    } catch (e) {
      dependencies.logger.warn(e, { type: 'tasks.loyaltyOperationClearCache' });
    }
  },
);
