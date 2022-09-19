const {
  createInvitation: createInvitationSchema,
  createInvitationAdmin: createInvitationAdminSchema,
  cashoutInvitation: cashoutInvitationSchema,
  createOperationAdmin: createOperationAdminSchema,
  createOperationExternal: createOperationExternalSchema,
  pointsExternal: pointsExternalSchema,
  pointsDetailedExternal: pointsDetailedExternalSchema,
  userPoints: userPointsSchema,
  userPointsDetailed: userPointsDetailedSchema,
  closeOperationExternal: closeOperationExternalSchema,
  operationTypesAdmin: operationTypesAdminSchema,

  getInvitations: getInvitationsSchema,
  getUsersActions: getUsersActionsSchema,
} = require('./schemas');

const {
  createInvitationHandler,
  cashoutInvitationHandler,
  userPointsHandler,
  userPointsDetailedHandler,
  closeOperationHandler,

  createOperationAdminHandler,
  createInvitationAdminHandler,
  operationTypesAdminHandler,

  createOperationExternalHandler,
  pointsExternalHandler,
  pointsDetailedExternalHandler,

  getInvitationsHandler,
  getUsersActionsHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify.register((_fastify, _opts, _done) => {
    _fastify.addHook('preHandler', _fastify.bearerAuth);

    _fastify
      .post('/invitation', { schema: createInvitationSchema }, createInvitationHandler)
      .post('/cashout', { schema: cashoutInvitationSchema }, cashoutInvitationHandler)

      .get('/points', { schema: userPointsSchema }, userPointsHandler)
      .get('/points/detailed', { schema: userPointsDetailedSchema }, userPointsDetailedHandler);

    _done();
  });

  fastify.register((_fastify, _opts, _done) => {
    _fastify.addHook('preHandler', _fastify.apiKeyAuth);

    _fastify
      .post('/private/invitation', { schema: createInvitationAdminSchema }, createInvitationAdminHandler)
      .post('/private/operation', { schema: createOperationAdminSchema }, createOperationAdminHandler)
      .post('/private/get-list-invitations', { schema: getInvitationsSchema }, getInvitationsHandler)
      .post('/private/get-list-users-actions', { schema: getUsersActionsSchema }, getUsersActionsHandler)
      .get('/private/types', { schema: operationTypesAdminSchema }, operationTypesAdminHandler);

    _fastify
      .post('/external/operation', { schema: createOperationExternalSchema }, createOperationExternalHandler)
      .post('/external/operation/cancel', { schema: closeOperationExternalSchema }, closeOperationHandler)
      .get('/external/points', { schema: pointsExternalSchema }, pointsExternalHandler)
      .get('/external/points/detailed', { schema: pointsDetailedExternalSchema }, pointsDetailedExternalHandler);

    _done();
  });

  done();
};

module.exports = routes;
