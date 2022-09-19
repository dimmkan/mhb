const cron = require('node-cron');
const env = require('infrastructure/config/env');
const createReport = require('application/use_cases/news/metaReport');

module.exports = (dependencies) => env.NEWS_REPORT_CRON_EXP && cron.schedule(
  env.NEWS_REPORT_CRON_EXP,
  async () => {
    try {
      await createReport(dependencies);
    } catch (e) {
      dependencies.logger.warn(e, { type: 'tasks.newsMetaReport' });
    }
  },
);
