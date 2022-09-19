const fp = require('fastify-plugin');
const verifyAccessToken = require('application/use_cases/token/verifyAccessToken');
const bearerFromHeaders = require('shared/utils/helper/bearerFromHeaders');

function plugin(fastify, options, done) {
  const verifyToken = verifyAccessToken(fastify.serviceLocator);

  fastify.decorate('bearerAuth', async (request) => {
    const token = bearerFromHeaders(request.headers);
    request.authCredentials = await verifyToken(token);
    request.isAuth = true;
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-bearer-auth',
});
