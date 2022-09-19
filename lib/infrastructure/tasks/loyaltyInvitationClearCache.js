const cron = require('node-cron');
const env = require('infrastructure/config/env');
const createInvitationClearCache = require('application/use_cases/loyalty/createInvitationClearCache');

module.exports = (dependencies) => env.LOYALTY_INVITATION_CLEAR_CACHE_CRON_EXP && cron.schedule(
  env.LOYALTY_INVITATION_CLEAR_CACHE_CRON_EXP,
  async () => {
    try {
      await createInvitationClearCache(dependencies);
    } catch (e) {
      dependencies.logger.warn(e, { type: 'tasks.loyaltyInvitationClearCache' });
    }
  },
);
