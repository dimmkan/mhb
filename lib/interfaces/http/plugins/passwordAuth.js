const fp = require('fastify-plugin');
const verifyByPasswordAndPhone = require('application/use_cases/auth/verifyByPasswordAndPhone');

function plugin(fastify, options, done) {
  fastify.decorate('passwordAuth', async (request) => {
    const { phone, password } = request.body;
    const user = await verifyByPasswordAndPhone(
      fastify.serviceLocator,
      phone,
      password,
    );
    user.password = undefined;
    request.authCredentials = user;
  });

  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-password-auth',
});
