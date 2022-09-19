const fp = require('fastify-plugin');
const serviceLocator = require('infrastructure/config/service-locator');

function plugin(fastify, options, done) {
  fastify.decorate('serviceLocator', serviceLocator);
  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-service-locator',
});
