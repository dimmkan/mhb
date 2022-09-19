const fastifyMultipartBodyDisk = require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk');
const env = require('infrastructure/config/env');
const {
  requestListSchema,
  categoriesListSchema,
  addRequestSchema,
  shutdownsListCurrentSchema,
  shutdownsListPlannedSchema,
  requestConfirmSchema,
  requestRejectSchema,
  uploadRequestImagesSchema,
  getRequestSchema,
  notificationsDisableSchema,
  addProfileSchema,
} = require('./schemas');

const {
  requestListHandler,
  categoriesListHandler,
  addRequestHandler,
  requestConfirmHandler,
  requestRejectHandler,
  shutdownsListCurrentHandler,
  shutdownsListPlannedHandler,
  uploadRequestImagesHandler,
  getRequestHandler,
  notificationsDisableHandler,
  addProfileHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .get('/requests', { schema: requestListSchema }, requestListHandler)
      .get('/requests/:requestId', { schema: getRequestSchema }, getRequestHandler)
      .get('/request/categories', { schema: categoriesListSchema }, categoriesListHandler)
      .get('/shutdowns/current', { schema: shutdownsListCurrentSchema }, shutdownsListCurrentHandler)
      .get('/shutdowns/planned', { schema: shutdownsListPlannedSchema }, shutdownsListPlannedHandler)
      .post('/request/confirm', { schema: requestConfirmSchema }, requestConfirmHandler)
      .post('/request/reject', { schema: requestRejectSchema }, requestRejectHandler)
      .post('/request', { schema: addRequestSchema }, addRequestHandler)
      .post('/notifications/disable', { schema: notificationsDisableSchema }, notificationsDisableHandler)
      .post('/request/images', { schema: uploadRequestImagesSchema }, uploadRequestImagesHandler)
      .register(fastifyMultipartBodyDisk, {
        tmpdir: env.FILE_TEMP_DIR,
        limits: { files: 10, fileSize: 2e+6 },
        allow: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
      });

    _done();
  });

  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.apiKeyAuth)
      .post('/profile', { schema: addProfileSchema }, addProfileHandler);

    _done();
  });

  done();
};

module.exports = routes;
