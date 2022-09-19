const _ = require('ramda');
const percentRound = require('percent-round');
const { AppError, errorCodes } = require('shared/errors');

const checkArrayInclude = _.curry((list, value) => list.includes(value));
const getPercent = _.curry((total, num) => ((num / total) * 100).toFixed(2));

const vote = async (
  dependencies,
  userId,
  {
    residentId,
    pollId,
    answers,
  },
) => {
  const {
    pollsAnswersRepository,
    cmsExternal,
    loyaltyManager,
    logger,
  } = dependencies;
  const userPollAnswerInfo = await pollsAnswersRepository.findByUserIdAndResidentId(
    userId,
    residentId,
    pollId,
  );

  if (userPollAnswerInfo.length) {
    throw new AppError(errorCodes.ALREADY_VOTED);
  }

  const poll = await cmsExternal.getPollById(pollId);

  if (poll.status === 'archived') {
    throw new AppError(errorCodes.POLL_IS_EXPIRED);
  }

  await Promise.all(
    answers.map(
      async (answer) => {
        await pollsAnswersRepository.persist({
          residentId,
          userId,
          pollId,
          answer,
        });
      },
    ),
  );

  const userAnswers = _.map(
    _.applySpec({
      answer: _.prop('id'),
      count: _.ifElse(
        _.compose(
          checkArrayInclude(answers),
          _.prop('id'),
        ),
        _.compose(_.inc, _.prop('count')),
        _.prop('count'),
      ),
      selected: _.compose(
        checkArrayInclude(answers),
        _.prop('id'),
      ),
    }),
  )(poll.answers);

  const total = _.compose(
    _.sum,
    _.pluck('count'),
  )(userAnswers);

  const countersRoundedPercent = percentRound(
    _.compose(
      _.map(
        _.ifElse(
          _.equals(0),
          _.always(0),
          getPercent(total),
        ),
      ),
      _.pluck('count'),
    )(userAnswers),
  );

  await loyaltyManager.debit(dependencies, {
    ...loyaltyManager.types.user.POLL_PARTIPATION,
    userId,
    source: 'main',
    sourceId: pollId,
  }).catch((e) => {
    logger.warn(
      e,
      {
        input: {
          ...loyaltyManager.types.user.POLL_PARTIPATION,
          userId,
          source: 'main',
          sourceId: pollId,
        },
        type: 'loyaltyManager.polls.vote',
      },
    );
  });

  cmsExternal.updatePollCounters({ id: pollId });

  return userAnswers.map((answer, index) => ({
    ...answer,
    percent: countersRoundedPercent[index],
  }));
};

module.exports = vote;
