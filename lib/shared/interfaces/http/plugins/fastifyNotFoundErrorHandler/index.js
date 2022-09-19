const fp = require('fastify-plugin');
const { AppError, errorCodes } = require('shared/errors');

function fastifyNotFoundErrorHandler(fastify, options, done) {
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send(new AppError(errorCodes.ROUTE_NOT_FOUND));
  });
  done();
}

module.exports = fp(fastifyNotFoundErrorHandler, {
  fastify: '>=0.43',
  name: 'fastify-not-found-error-handler',
});
