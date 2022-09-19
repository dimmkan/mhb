const { DateTime } = require('luxon');

module.exports = async function createIndication(
  dependencies,
  {
    id,
    indicationId,
    value,
    zone,
    userId,
  },
) {
  const { residentProfileRepository, nedolzhnikExternal, loyaltyManager } = dependencies;
  const { residentId } = await residentProfileRepository.get(id);
  const indication = nedolzhnikExternal.createIndication(residentId, {
    id: indicationId, value, zone,
  });

  const dateTime = DateTime.local().setZone('Europe/Moscow');
  if (dateTime.day < 21) {
    await loyaltyManager.onceDebit(dependencies, {
      userId,
      ...loyaltyManager.types.user.CREATE_INDICATION,
      fingerprint: `${userId}:${dateTime.toFormat('yyyy-MM')}`,
    });
  }

  return indication;
};
