const _ = require('ramda');

module.exports = async function getIndications(
  { residentProfileRepository, nedolzhnikExternal },
  { id },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getCharge(residentId).then(_.compose(
    _.map(([date, values]) => ({ date, ...values })),
    _.toPairs,
    _.omit(['last_date']),
  ));
};
