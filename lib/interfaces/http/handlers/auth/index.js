const {
  registrationRequest: registrationRequestSchema,
  registration: registrationSchema,
  login: loginSchema,
  logout: logoutSchema,
  refresh: refreshSchema,
  resetPasswordEmailRequest: resetPasswordEmailRequestSchema,
  resetPasswordEmail: resetPasswordEmailSchema,
  resetPasswordPhoneRequest: resetPasswordPhoneRequestSchema,
  resetPasswordPhone: resetPasswordPhoneSchema,
} = require('./schemas');

const {
  loginHandler,
  logoutHandler,
  registrationHandler,
  registrationRequestHandler,
  refreshHandler,
  resetPasswordEmailRequestHandler,
  resetPasswordEmailHandler,
  resetPasswordPhoneRequestHandler,
  resetPasswordPhoneHandler,
  verifyUniquePhoneOrEmailHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.addHook('preHandler', fastify.sanitizeBodyPhone);
  // Unlogged APIs
  fastify.post('/login', {
    schema: loginSchema,
    preHandler: fastify.passwordAuth,
    handler: loginHandler(fastify),
  });

  fastify.route({
    method: 'POST',
    url: '/register',
    schema: registrationRequestSchema,
    preHandler: [
      verifyUniquePhoneOrEmailHandler,
      fastify.residentProfile.verifyResidentIdHandler,
    ],
    handler: registrationRequestHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/register/code',
    schema: registrationSchema,
    handler: registrationHandler(fastify),
  });

  fastify.post('/refresh', {
    schema: refreshSchema,
    handler: refreshHandler(fastify),
  });

  fastify.post('/reset-password/email', {
    schema: resetPasswordEmailRequestSchema,
    handler: resetPasswordEmailRequestHandler,
  });
  fastify.post('/reset-password/email/code', {
    schema: resetPasswordEmailSchema,
    handler: resetPasswordEmailHandler,
  });

  fastify.post('/reset-password/phone', {
    schema: resetPasswordPhoneRequestSchema,
    handler: resetPasswordPhoneRequestHandler,
  });
  fastify.post('/reset-password/phone/code', {
    schema: resetPasswordPhoneSchema,
    handler: resetPasswordPhoneHandler,
  });

  // Logged APIs
  fastify.register((_fastify, _opts, _done) => {
    _fastify.addHook('preHandler', _fastify.bearerAuth);
    _fastify.post('/logout', { schema: logoutSchema }, logoutHandler);
    _done();
  });
  done();
};

module.exports = routes;
