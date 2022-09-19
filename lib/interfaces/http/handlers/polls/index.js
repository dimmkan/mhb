const {
  vote: voteSchema,
  getUserAnswersByResidentId: getUserAnswersByResidentIdSchema,
  getPollAnswersCountersWebhook: getPollAnswersCountersWebhookSchema,
  getResultsWebhook: getResultsWebhookSchema,
} = require('./schemas');

const {
  voteHandler,
  getUserAnswersByResidentIdHandler,
  getPollAnswersCountersWebhookHandler,
  getResultsWebhookHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify.register((_fastify, opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .get(
        '/user-answers/find-by-resident-id/:residentId',
        { schema: getUserAnswersByResidentIdSchema },
        getUserAnswersByResidentIdHandler,
      )
      .post('/vote', { schema: voteSchema }, voteHandler);
    _done();
  });

  fastify.route({
    method: 'GET',
    url: '/:pollId/results',
    schema: getResultsWebhookSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: getResultsWebhookHandler,
  });

  fastify.route({
    method: 'GET',
    url: '/:pollId/results/answers-counters',
    schema: getPollAnswersCountersWebhookSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: getPollAnswersCountersWebhookHandler,
  });

  done();
};

module.exports = routes;
