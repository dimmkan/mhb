/**
 * Схемы для валидации
 * */
const {
  receiveFCMTokenSchema,
  listNotificationSchema,
  markReadNotificationSchema,
  addNotificationByUserSchema,
  addByManagingCompanyNotificationSchema,
  notificationEdsChangeRequestStatusSchema,
  notificationEdsRequestDoneSchema,
  notificationEdsPlanningShutdownSchema,
  notificationEdsEmergencyShutdownSchema,
  notificationEdsServiceChangeRequestSchema,
  notificationEdsServiceRequestDoneSchema,
  addByAddressOssNotificationSchema,
  addByAddressNotificationSchema,
  countUnreadableUserNotificationSchema,
  administrativeAppealsChangeStatusSchema,
} = require('./schemas');

/**
 * Хэндлеры запросов
 * */
const {
  receiveFCMTokenHandler,
  listNotificationHandler,
  markReadNotificationHandler,
  addByUserNotificationHandler,
  addByAddressOssNotificationHandler,
  addByManagingCompanyNotificationHandler,
  notificationEdsChangeRequestStatusHandler,
  notificationEdsRequestDoneHandler,
  notificationEdsServiceChangeRequestStatusHandler,
  notificationEdsServiceRequestDoneHandler,
  notificationEdsPlanningShutdownHandler,
  notificationEdsEmergencyShutdownHandler,
  addByAddressNotificationHandler,
  countUnreadableUserNotificationHandler,
  administrativeAppealsChangeStatusHandler,
} = require('./handlers');

/**
 *  Роуты для notifications
 * */

const routes = (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/fcm-token',
    schema: receiveFCMTokenSchema,
    preHandler: [fastify.bearerAuth],
    handler: receiveFCMTokenHandler,
  });

  fastify.route({
    method: 'GET',
    url: '/list',
    schema: listNotificationSchema,
    preHandler: [fastify.bearerAuth],
    handler: listNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/list/:messageId/mark-read',
    schema: markReadNotificationSchema,
    preHandler: [fastify.bearerAuth],
    handler: markReadNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user',
    schema: addNotificationByUserSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: addByUserNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-address/oss',
    schema: addByAddressOssNotificationSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: addByAddressOssNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-address',
    schema: addByAddressNotificationSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: addByAddressNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-managing-company',
    schema: addByManagingCompanyNotificationSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: addByManagingCompanyNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-change-request-status',
    schema: notificationEdsChangeRequestStatusSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsChangeRequestStatusHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-request-done',
    schema: notificationEdsRequestDoneSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsRequestDoneHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-planning-shutdown',
    schema: notificationEdsPlanningShutdownSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsPlanningShutdownHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-emergency-shutdown',
    schema: notificationEdsEmergencyShutdownSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsEmergencyShutdownHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-service-change-request-status',
    schema: notificationEdsServiceChangeRequestSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsServiceChangeRequestStatusHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user/eds-service-request-done',
    schema: notificationEdsServiceRequestDoneSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: notificationEdsServiceRequestDoneHandler,
  });

  fastify.route({
    method: 'GET',
    url: '/count-unreadable',
    schema: countUnreadableUserNotificationSchema,
    preHandler: [fastify.bearerAuth],
    handler: countUnreadableUserNotificationHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/add-by-user-appeals',
    schema: administrativeAppealsChangeStatusSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: administrativeAppealsChangeStatusHandler,
  });

  done();
};

module.exports = routes;
