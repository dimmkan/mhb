const fastifyMultipartBodyDisk = require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk');
const env = require('infrastructure/config/env');
const {
  patchProfile: patchProfileSchema,
  changePassword: changePasswordSchema,

  changePhoneRequest: changePhoneRequestSchema,
  changePhone: changePhoneSchema,

  changeEmailRequest: changeEmailRequestSchema,
  changeEmail: changeEmailSchema,

  getAvatar: getAvatarSchema,
  avatar: avatarSchema,
  getPassport: getPassportSchema,
  passport: passportSchema,

  user: userSchema,
  filteredUserList: filteredUserListSchema,
  deleteAvatar: deleteAvatarSchema,
  deleteUser: deleteUserSchema,
} = require('./schemas');

const {
  getUserHandler,
  patchProfileHandler,
  changePasswordHandler,

  changeEmailRequestHandler,
  changeEmailHandler,

  changePhoneRequestHandler,
  changePhoneHandler,

  avatarHandler,
  passportHandler,

  getAvatarHandler,
  getPassportHandler,
  getFilteredUsersListHandler,
  deleteAvatarHandler,
  deleteUserHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .addHook('preHandler', _fastify.sanitizeBodyPhone)
      .get('/', { schema: userSchema }, getUserHandler)
      .patch('/', { schema: patchProfileSchema }, patchProfileHandler)
      .delete('/', { schema: deleteUserSchema }, deleteUserHandler)
      .post('/change-password', { schema: changePasswordSchema }, changePasswordHandler)
      .post('/change-phone', { schema: changePhoneRequestSchema }, changePhoneRequestHandler)
      .post('/change-phone/code', { schema: changePhoneSchema }, changePhoneHandler)
      .post('/change-email', { schema: changeEmailRequestSchema }, changeEmailRequestHandler)
      .post('/change-email/code', { schema: changeEmailSchema }, changeEmailHandler)
      .get('/avatar', { schema: getAvatarSchema }, getAvatarHandler)
      .delete('/avatar', { schema: deleteAvatarSchema }, deleteAvatarHandler)
      .get('/passport', { schema: getPassportSchema }, getPassportHandler)
      .register(fastifyMultipartBodyDisk, {
        tmpdir: env.FILE_TEMP_DIR,
        limits: { files: 1, fileSize: 5e+6 },
        allow: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
      })
      .post('/avatar', { schema: avatarSchema }, avatarHandler)
      .post('/passport', { schema: passportSchema }, passportHandler);

    _done();
  });

  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .post('/filtered-users-list', {
        schema: filteredUserListSchema,
        preHandler: fastify.apiKeyAuth,
        handler: getFilteredUsersListHandler,
      });

    _done();
  });

  done();
};

module.exports = routes;
