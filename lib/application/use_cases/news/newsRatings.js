const defaultValues = { userId: 0, sessionId: '' };

const _ = require('ramda');

const rateObj = _.compose(_.objOf('rate'), _.propOr('NEUTRAL', 'rate'));

module.exports = (
  { targetRateRepository },
  { id: targetId, userId, sessionId } = defaultValues,
) => (
  targetRateRepository.targetRate({ targetId, userId, sessionId })
    .then((result) => (
      (Array.isArray(targetId))
        ? result
        : rateObj(result)
    ))
);
