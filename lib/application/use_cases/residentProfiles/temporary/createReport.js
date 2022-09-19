const _ = require('ramda');
const { DBFFile } = require('dbffile');
const { unlink } = require('fs').promises;
const { nanoid } = require('nanoid');

const renameObjectKeys = require('shared/utils/helper/renameObjectKeys');
const env = require('infrastructure/config/env');
const asyncRetry = require('shared/utils/helper/asyncRetry');

const dateWithTzOffset = (date) => new Date(
  date.getTime() + (date.getTimezoneOffset() * 60 * 1000 * -1),
);

const getServiceType = (name) => {
  const n = name.toUpperCase();
  if (n.includes('ВОДО')) return 'WATER';
  if (n.includes('ГАЗ')) return 'GAZ';
  if (n.includes('ОТОПЛ')) return 'HEAT';
  if (n.includes('ЭЛЕКТ')) return 'ELECTICITY';
  return 'UNKNOWN';
};

const formatIndication = _.compose(
  renameObjectKeys({
    name: 'counter_id',
    resident_id: 'account_id',
    value: 'data',
    dateWithTzOffset: 'datein',
    month: 'month_n',
    year: 'year_n',
  }),
  _.converge(
    _.unapply(_.mergeAll),
    [
      _.identity,
      () => ({ consump: 0 }),
      ({ value }) => ({ value: parseFloat(value) }),
      ({ date }) => ({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        dateWithTzOffset: dateWithTzOffset(date),
      }),
      _.compose(
        _.objOf('type'),
        getServiceType,
        _.prop('service_name'),
      ),
    ],
  ),
);

const createDbf = async (data, { tempdir, filename }) => {
  const ext = '.dbf';
  const fullPath = `${tempdir}/${nanoid(12)}${ext}`;
  try {
    await DBFFile
      .create(fullPath, [
        { name: 'account_id', type: 'C', size: 255 },
        { name: 'counter_id', type: 'C', size: 255 },
        { name: 'data', type: 'N', size: 20 },
        { name: 'month_n', type: 'N', size: 20 },
        { name: 'year_n', type: 'N', size: 20 },
        { name: 'datein', type: 'D', size: 8 },
        { name: 'consump', type: 'N', size: 20 },
      ])
      .then((dbf) => dbf.appendRecords(data));

    return { path: fullPath, filename: filename + ext };
  } catch (e) {
    await unlink(fullPath).catch(() => {});
    throw e;
  }
};

const createFilename = ({ type, date }) => `EXPORT_${type}_${date.replace(/-/g, '').slice(0, 6)}`;

const createHtmlLinks = _.compose(
  _.join('<br><br>'),
  _.map(({ filename, id }) => `<a href="${env.CMS_EXT_PUBLIC_URL}/assets/${id}?download">${filename}</a>`),
);

const retry10 = (fn) => asyncRetry(fn, {
  retries: 10,
  minTimeout: 60 * 1000,
  maxTimeout: 15 * 60 * 1000,
  randomize: true,
});

module.exports = async function createReport(
  { residentIndicationsRepository, cmsExternal, emailExternal },
  { from, to },
) {
  const indications = await residentIndicationsRepository.getLatestsByDateBetween(from, to)
    .then(_.compose(
      (p) => Promise.all(p),
      _.map(async ([type, data]) => {
        const { path, filename } = await createDbf(data, {
          tempdir: env.FILE_TEMP_DIR,
          filename: createFilename({ type, date: to }),
        });
        try {
          const { id } = await retry10(() => cmsExternal.uploadFiles({ path, filename }));
          return { filename, id };
        } finally {
          await unlink(path);
        }
      }),
      _.toPairs,
      _.map(_.map(_.omit(['type']))),
      _.groupBy(_.prop('type')),
      _.map(formatIndication),
    ));

  await retry10(
    () => emailExternal.send(
      env.INDICATION_REPORT_EMAIL,
      createHtmlLinks(indications),
      'Показания приборов учёта',
    ),
  );

  return true;
};
