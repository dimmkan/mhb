const _ = require('ramda');
const { DateTime } = require('luxon');
const { AppError, errorCodes } = require('shared/errors');

const indicationTimestamp = _.compose(
  (date) => new Date(date).getTime(),
  _.path(['last_indication', 'date']),
);

const lastIndicationSpec = (id) => _.compose(
  _.tap((v) => { if (!v) { throw new AppError(errorCodes.BAD_REQUEST, { description: 'Indication id not found' }); } }),
  _.last,
  _.sort((a, b) => indicationTimestamp(a) - indicationTimestamp(b)),
  _.filter(_.propEq('id', id)),
  (x) => x.flat(1),
);

module.exports = async function createIndicationLegacy(
  dependencies,
  {
    id,
    indicationId,
    value,
    zone,
    userId,
    imageId,
  },
) {
  const {
    residentProfileRepository,
    nedolzhnikExternal,
    residentIndicationsRepository,
    cmsExternal,
    loyaltyManager,
  } = dependencies;

  const { residentId } = await residentProfileRepository.get(id);
  const { name, serviceName } = await nedolzhnikExternal.getIndications(residentId)
    .then(_.compose(
      _.zipObj(['name', 'serviceName']),
      _.paths([['name'], ['service', 'name']]),
      lastIndicationSpec(indicationId),
    ));

  const dateTime = DateTime.local().setZone('Europe/Moscow');
  const date = dateTime.toFormat('yyyy-MM-dd');

  if (typeof name === 'string' && name.length) {
    await residentIndicationsRepository.persist({
      residentId,
      value,
      date,
      name,
      serviceName,
    });
  }

  await nedolzhnikExternal.createIndication(residentId, {
    id: indicationId, value, zone, name,
  });

  await cmsExternal.createIndication({
    userId,
    profileId: id,
    residentId,
    value,
    date,
    image: imageId,
    name,
    serviceName,
  });

  if (dateTime.day < 21) {
    await loyaltyManager.onceDebit(dependencies, {
      userId,
      ...loyaltyManager.types.user.CREATE_INDICATION,
      fingerprint: `${userId}:${dateTime.toFormat('yyyy-MM')}`,
    });
  }

  return true;
};
