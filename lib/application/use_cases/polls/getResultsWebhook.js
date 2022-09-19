const _ = require('ramda');

const dateWithTzOffset = (date) => new Date(
  date.getTime() + (date.getTimezoneOffset() * 60 * 1000 * -1),
);

const getResultsWebhook = async (
  {
    pollsAnswersRepository,
    cmsExternal,
  },
  pollId,
) => {
  const poll = await cmsExternal.getPollById(pollId);

  const pollParticipantsAnswers = await pollsAnswersRepository.getPollParticipantsAnswers(pollId);

  return {
    participants: pollParticipantsAnswers.map((participant) => ({
      address: participant.result ? participant.result : participant.source,
      answers: participant.answer.split(',').map(
        (answer) => poll.answers.find((a) => answer === String(a.id)).text,
      ),
      date: dateWithTzOffset(participant.date),
    })),
  };
};

module.exports = getResultsWebhook;
