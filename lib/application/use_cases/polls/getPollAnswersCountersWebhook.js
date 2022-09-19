const _ = require('ramda');

const getPollAnswersCountersWebhook = async (
  { pollsAnswersRepository },
  pollId,
) => {
  const answers = await pollsAnswersRepository.getPollResults(
    pollId,
  );

  return { answers };
};

module.exports = getPollAnswersCountersWebhook;
