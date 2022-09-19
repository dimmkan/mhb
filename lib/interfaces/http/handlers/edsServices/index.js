const fastifyMultipartBodyDisk = require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk');
const env = require('infrastructure/config/env');
const {
  createRequest: createRequestSchema,
  request: requestSchema,
  requests: requestsSchema,
  requestsPaymentUrl: requestsPaymentUrlSchema,
  requestsCategoriesWithPrice: requestsCategoriesWithPriceSchema,
  notificationsDisable: notificationsDisableSchema,
  bonuses: bonusesSchema,
  uploadImages: uploadImagesSchema,
  addProfile: addProfileSchema,
} = require('./schemas');

const {
  createRequestHandler,
  requestHandler,
  requestsHandler,
  requestsPaymentUrlHandler,
  requestsCategoriesWithPriceHandler,
  notificationsDisableHandler,
  bonusesHandler,
  uploadImagesHandler,
  addProfileHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .post('/requests', { schema: createRequestSchema }, createRequestHandler)
      .get('/requests', { schema: requestsSchema }, requestsHandler)
      .get('/requests/:id', { schema: requestSchema }, requestHandler)
      .get('/requests/:id/payment-url', { schema: requestsPaymentUrlSchema }, requestsPaymentUrlHandler)
      .get('/requests/categories', { schema: requestsCategoriesWithPriceSchema }, requestsCategoriesWithPriceHandler)

      .get('/bonuses', { schema: bonusesSchema }, bonusesHandler)
      .post('/notifications/disable', { schema: notificationsDisableSchema }, notificationsDisableHandler)

      .register(fastifyMultipartBodyDisk, {
        tmpdir: env.FILE_TEMP_DIR,
        limits: { files: 10, fileSize: 2e+6 },
        allow: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
      })
      .post('/requests/images', { schema: uploadImagesSchema }, uploadImagesHandler);

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
