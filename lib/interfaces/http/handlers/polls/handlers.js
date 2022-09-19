const vote = require('application/use_cases/polls/vote');
const getUserAnswersByResidentId = require('application/use_cases/polls/getUserAnswersByResidentId');
const getPollAnswersCountersWebhook = require('application/use_cases/polls/getPollAnswersCountersWebhook');
const getResultsWebhook = require('application/use_cases/polls/getResultsWebhook');

async function voteHandler(req) {
  const { id: userId } = req.authCredentials;
  const res = await vote(this.serviceLocator, userId, { ...req.body });

  return res;
}

async function getUserAnswersByResidentIdHandler(req) {
  const { id: userId } = req.authCredentials;
  const { residentId } = req.params;
  const { ids: pollIds } = req.query;
  const res = await getUserAnswersByResidentId(this.serviceLocator, userId, residentId, pollIds);

  return res;
}

async function getPollAnswersCountersWebhookHandler(req) {
  const { pollId } = req.params;
  const res = await getPollAnswersCountersWebhook(this.serviceLocator, pollId);

  return res;
}

async function getResultsWebhookHandler(req) {
  const { pollId } = req.params;
  const res = await getResultsWebhook(this.serviceLocator, pollId);

  return res;
}

module.exports = {
  voteHandler,
  getUserAnswersByResidentIdHandler,
  getPollAnswersCountersWebhookHandler,
  getResultsWebhookHandler,
};
