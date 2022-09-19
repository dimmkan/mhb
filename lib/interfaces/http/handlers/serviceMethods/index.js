const {
  regenerateEdsSchema,
} = require('./schemas');

const {
  regenerateEdsHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.apiKeyAuth)
      .post('/regenerateEds', { schema: regenerateEdsSchema }, regenerateEdsHandler);

    _done();
  });

  done();
};

module.exports = routes;
