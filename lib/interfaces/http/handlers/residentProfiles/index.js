const fastifyMultipartBodyDisk = require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk');
const env = require('infrastructure/config/env');
const {
  getResidentProfiles: getResidentProfilesSchema,
  createResidentProfile: createResidentProfileSchema,
  deleteResidentProfile: deleteResidentProfileSchema,
  forceDeleteResidentProfile: forceDeleteResidentProfileSchema,

  getUsers: getUsersSchema,
  acceptUser: acceptUserSchema,
  declineUser: declineUserSchema,
  deleteUser: deleteUserSchema,

  createIndication: createIndicationSchema,
  getIndications: getIndicationsSchema,
  getPaymentLink: getPaymentLinkSchema,
  getReceipt: getReceiptSchema,
  getMeashures: getMeashuresSchema,
  getCharges: getChargesSchema,
  getPayments: getPaymentsSchema,
  getBalance: getBalanceSchema,
  createIndicationTemporary: createIndicationTemporarySchema,
  uploadIndicationImage: uploadIndicationImageSchema,
  getResidentProfile: getResidentProfileSchema,
} = require('./schemas');

const {
  getUsersHandler,
  acceptUserHandler,
  declineUserHandler,
  deleteUserHandler,

  getResidentProfilesHandler,
  createResidentProfileHandler,
  deleteResidentProfileHandler,
  forceDeleteResidentProfileHandler,

  createIndicationHandler,
  getIndicationsHandler,
  getPaymentLinkHandler,
  getReceiptHandler,
  getMeashuresHandler,
  getChargesHandler,
  getPaymentsHandler,
  getBalanceHandler,
  createIndicationTemporaryHandler,
  uploadIndicationImageHandler,
  getResidentProfileHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify.register((_fastify, _opts, _done) => {
    const {
      residentProfile: {
        verifyResidentIdHandler,
        roles,
        withRoleHandler,
      },
    } = fastify;

    const isUserRole = withRoleHandler([roles.USER]);
    const isOwnerRole = withRoleHandler([roles.OWNER]);

    _fastify
      .addHook('preHandler', fastify.bearerAuth)
      .get('/', {
        schema: getResidentProfilesSchema,
        handler: getResidentProfilesHandler,
      })
      .get('/:id', {
        schema: getResidentProfileSchema,
        handler: getResidentProfileHandler,
      })
      .post('/', {
        schema: createResidentProfileSchema,
        preHandler: verifyResidentIdHandler,
        handler: createResidentProfileHandler,
      })
      .delete('/:id', {
        schema: deleteResidentProfileSchema,
        preHandler: isUserRole,
        handler: deleteResidentProfileHandler,
      })
      .delete('/:id/force', {
        schema: forceDeleteResidentProfileSchema,
        preHandler: isUserRole,
        handler: forceDeleteResidentProfileHandler,
      });

    _fastify
      .get('/users', {
        schema: getUsersSchema,
        handler: getUsersHandler,
      })
      .post('/users/:id/accept', {
        schema: acceptUserSchema,
        preHandler: isOwnerRole,
        handler: acceptUserHandler,
      })
      .post('/users/:id/decline', {
        schema: declineUserSchema,
        preHandler: isOwnerRole,
        handler: declineUserHandler,
      })
      .delete('/users/:id', {
        schema: deleteUserSchema,
        preHandler: isOwnerRole,
        handler: deleteUserHandler,
      });

    _fastify
      .get('/:id/meashures', {
        schema: getMeashuresSchema,
        preHandler: isUserRole,
        handler: getMeashuresHandler,
      })
      .get('/:id/indications', {
        schema: getIndicationsSchema,
        preHandler: isUserRole,
        handler: getIndicationsHandler,
      })
      .post('/:id/indications', {
        schema: createIndicationSchema,
        preHandler: isUserRole,
        handler: createIndicationHandler,
      })
      .post('/:id/indications/temporary', {
        schema: createIndicationTemporarySchema,
        preHandler: isUserRole,
        handler: createIndicationTemporaryHandler,
      })
      .get('/:id/receipt', {
        schema: getReceiptSchema,
        preHandler: isUserRole,
        handler: getReceiptHandler,
      })
      .get('/:id/charges', {
        schema: getChargesSchema,
        preHandler: isUserRole,
        handler: getChargesHandler,
      })
      .get('/:id/payment-link', {
        schema: getPaymentLinkSchema,
        preHandler: isUserRole,
        handler: getPaymentLinkHandler,
      })
      .get('/:id/payments', {
        schema: getPaymentsSchema,
        preHandler: isUserRole,
        handler: getPaymentsHandler,
      })
      .get('/:id/balance', {
        schema: getBalanceSchema,
        preHandler: isUserRole,
        handler: getBalanceHandler,
      });

    _fastify.register(fastifyMultipartBodyDisk, {
      tmpdir: env.FILE_TEMP_DIR,
      limits: { files: 1, fileSize: 5e+6 },
      allow: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
    })
      .post(
        '/:id/indications/image',
        { schema: uploadIndicationImageSchema },
        uploadIndicationImageHandler,
      );

    _done();
  });

  done();
};

module.exports = routes;
