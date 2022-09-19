const _ = require('ramda');
const cron = require('node-cron');
const { DateTime } = require('luxon');
const createReport = require('application/use_cases/residentProfiles/temporary/createReport');
const env = require('infrastructure/config/env');

const reportDateBetween = () => {
  const dtMsk = () => DateTime.local().setZone('Europe/Moscow');
  return _.map((dt) => dt.toFormat('yyyy-MM-dd'), {
    from: dtMsk().minus({ month: 1 }).set({ day: 21 }),
    to: dtMsk().set({ day: 20 }),
  });
};

module.exports = (dependencies) => env.INDICATION_REPORT_CRON_EXP && cron.schedule(
  env.INDICATION_REPORT_CRON_EXP,
  async () => {
    try {
      await createReport(dependencies, reportDateBetween());
    } catch (e) {
      dependencies.logger.warn(e, { type: 'tasks.indicationsReport' });
    }
  },
);
