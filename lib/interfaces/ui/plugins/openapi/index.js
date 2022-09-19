const fp = require('fastify-plugin');
const fastifySwagger = require('@fastify/swagger');
const env = require('infrastructure/config/env');

const tags = require('./tags');
const info = require('./info');
const components = require('./components');
const servers = require('./servers');

const plugin = (fastify, opts, done) => {
  fastify.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: `${env.HTTP_API_PREFIX}/${env.HTTP_UI_OPENAPI_PREFIX}`,
    openapi: {
      info,
      servers,
      components,
      tags,
    },
  });

  done();
};

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-openapi-custom',
});
