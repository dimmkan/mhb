const {
  rateNews: rateNewsSchema,
  news: newsSchema,
  newsMarkRead: newsMarkReadSchema,
} = require('./schemas');

const {
  newsItemWithUserMetaHandler,
  rateNewsHandler,
  traceNewsViewHandler,
  newsWithUserMetaHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.get(
    '/',
    {
      schema: newsSchema,
      preHandler: fastify.bearerAuthOrAnonym,
      handler: newsWithUserMetaHandler(fastify),
    },
  );

  fastify.get(
    '/:newsId',
    {
      schema: newsSchema,
      preHandler: fastify.bearerAuthOrAnonym,
      handler: newsItemWithUserMetaHandler(fastify),
    },
  );
  fastify.post(
    '/:newsId/rate',
    {
      schema: rateNewsSchema,
      preHandler: fastify.bearerAuthOrAnonym,
      handler: rateNewsHandler,
    },
  );

  fastify.post(
    '/:newsId/mark-read',
    {
      schema: newsMarkReadSchema,
      preHandler: fastify.bearerAuthOrAnonym,
      handler: traceNewsViewHandler,
    },
  );
  done();
};

module.exports = routes;
