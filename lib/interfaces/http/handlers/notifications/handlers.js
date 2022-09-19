const receiveFCMToken = require('application/use_cases/notifications/receiveFCMToken');
const getListNotifications = require('application/use_cases/notifications/getListNotifications');
const markReadNotification = require('application/use_cases/notifications/markReadNotification');
const addByUserNotification = require('application/use_cases/notifications/addByUserNotification');
const addByManagingCompanyNotification = require('application/use_cases/notifications/addByManagingCompanyNotification');
const addByAddressOssNotification = require('application/use_cases/notifications/addByAddressOssNotification');
const edsChangeRequestStatusNotification = require('application/use_cases/notifications/edsChangeRequestStatusNotification');
const edsRequestDoneNotification = require('application/use_cases/notifications/edsRequestDoneNotification');
const edsServiceChangeRequestStatusNotification = require('application/use_cases/notifications/edsServiceChangeRequestStatusNotification');
const edsServiceRequestDoneNotification = require('application/use_cases/notifications/edsServiceRequestDoneNotification');
const edsPlanningShutdownNotification = require('application/use_cases/notifications/edsPlannigShutdownNotification');
const edsEmergencyShutdownNotification = require('application/use_cases/notifications/edsEmergencyShutdownNotification');
const addByAddressNotification = require('application/use_cases/notifications/addByAddressNotification');
const getCountUnreadableUserNotifications = require('application/use_cases/notifications/getCountUnreadableUserNotifications');
const administrativeAppealsChangeStatusNotififcation = require('application/use_cases/notifications/administrativeAppealsChangeStatusNotififcation');

async function receiveFCMTokenHandler(req) {
  const { rId, id } = req.authCredentials;
  const { FCMToken } = req.body;
  const data = {
    user_id: id,
    refresh_id: rId,
    firebase_token: FCMToken,
  };
  await receiveFCMToken(this.serviceLocator, data);
  return { success: true };
}

function listNotificationHandler(req) {
  const { id } = req.authCredentials;
  const { page, limit } = req.query;
  return getListNotifications(this.serviceLocator, { id, page: page || 1, limit: limit || 10 });
}

function markReadNotificationHandler(req) {
  const { messageId } = req.params;
  const { id } = req.authCredentials;
  return markReadNotification(this.serviceLocator, id, +messageId);
}

function addByUserNotificationHandler(req) {
  return addByUserNotification(this.serviceLocator, req.body);
}

function addByAddressOssNotificationHandler(req) {
  return addByAddressOssNotification(this.serviceLocator, req.body);
}

function addByAddressNotificationHandler(req) {
  return addByAddressNotification(this.serviceLocator, req.body);
}

function addByManagingCompanyNotificationHandler(req) {
  return addByManagingCompanyNotification(this.serviceLocator, req.body);
}

function notificationEdsChangeRequestStatusHandler(req) {
  return edsChangeRequestStatusNotification(this.serviceLocator, req.body);
}

function notificationEdsRequestDoneHandler(req) {
  return edsRequestDoneNotification(this.serviceLocator, req.body);
}

function notificationEdsServiceChangeRequestStatusHandler(req) {
  return edsServiceChangeRequestStatusNotification(this.serviceLocator, req.body);
}

function notificationEdsServiceRequestDoneHandler(req) {
  return edsServiceRequestDoneNotification(this.serviceLocator, req.body);
}

function notificationEdsPlanningShutdownHandler(req) {
  return edsPlanningShutdownNotification(this.serviceLocator, req.body);
}

function notificationEdsEmergencyShutdownHandler(req) {
  return edsEmergencyShutdownNotification(this.serviceLocator, req.body);
}

function countUnreadableUserNotificationHandler(req) {
  const { id } = req.authCredentials;
  return getCountUnreadableUserNotifications(this.serviceLocator, id);
}

function administrativeAppealsChangeStatusHandler(req) {
  return administrativeAppealsChangeStatusNotififcation(this.serviceLocator, req.body);
}

module.exports = {
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
};
