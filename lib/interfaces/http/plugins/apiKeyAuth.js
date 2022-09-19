const fp = require('fastify-plugin');
const verifyApiKeyToken = require('application/use_cases/token/verifyApiKeyToken');
const { AppError, errorCodes } = require('shared/errors');

function plugin(fastify, options, done) {
  fastify.decorate('apiKeyAuth', async (request) => {
    const { headers } = request;
    const apiKey = (headers.token || headers.Token || '').toString();
    if (!apiKey) throw new AppError(errorCodes.BAD_TOKEN);

    request.authCredentials = verifyApiKeyToken(apiKey);
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-token-auth',
});
