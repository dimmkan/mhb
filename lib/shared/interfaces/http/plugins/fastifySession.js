const fp = require('fastify-plugin');
const fastifySession = require('@fastify/session');
const { nanoid } = require('nanoid');

function plugin(fastify, options, done) {
  fastify.register(fastifySession, {
    ...options,
    idGenerator: ({ session }) => {
      if (session.returningVisitor) return `returningVisitor-${nanoid(12)}`;
      return nanoid(12);
    },
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '>=3.0',
  name: 'fastify-session-custom',
});
