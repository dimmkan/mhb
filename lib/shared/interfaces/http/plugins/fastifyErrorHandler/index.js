const fp = require('fastify-plugin');
const devhandler = require('./lib/devHandler');
const prodHandler = require('./lib/prodHandler');

const NODE_ENV = (process.env.NODE_ENV || 'prod').trim().toLowerCase();

function fastifyErrorHandler(fastify, options, done) {
  fastify.setErrorHandler(
    NODE_ENV.startsWith('prod')
      ? prodHandler
      : devhandler,
  );
  done();
}

module.exports = fp(fastifyErrorHandler, {
  fastify: '>=0.43',
  name: 'fastify-error-handler',
});
