/** Eds UseCases */
const getRequestList = require('application/use_cases/eds/getRequestList');
const getCategories = require('application/use_cases/eds/getCategories');
const addRequest = require('application/use_cases/eds/addRequest');
const confirmEdsRequest = require('application/use_cases/eds/confirmEdsRequest');
const rejectEdsRequest = require('application/use_cases/eds/rejectEdsRequest');
const getCurrentShutdownsList = require('application/use_cases/eds/getCurrentShutdownsList');
const getPlannedShutdownsList = require('application/use_cases/eds/getPlannedShutdownList');
const uploadRequestImages = require('application/use_cases/eds/uploadRequestImages');
const getRequest = require('application/use_cases/eds/getRequest');
const disableNotifications = require('application/use_cases/eds/disableNotifications');
const addProfile = require('application/use_cases/eds/addProfile');

function requestListHandler(req) {
  const { id } = req.authCredentials;
  const { page, limit } = req.query;
  return getRequestList(this.serviceLocator, { id, page, limit });
}

function categoriesListHandler() {
  return getCategories(this.serviceLocator);
}

function addRequestHandler(req) {
  return addRequest(this.serviceLocator, {
    ...req.body,
    userId: req.authCredentials.id,
  });
}

function requestConfirmHandler(req) {
  return confirmEdsRequest(this.serviceLocator, {
    ...req.body,
    option: 0,
    userId: req.authCredentials.id,
  });
}

function requestRejectHandler(req) {
  return rejectEdsRequest(this.serviceLocator, { ...req.body, option: 1 });
}

function shutdownsListCurrentHandler(req) {
  return getCurrentShutdownsList(this.serviceLocator, { userId: req.authCredentials.id });
}

function shutdownsListPlannedHandler(req) {
  return getPlannedShutdownsList(this.serviceLocator, { userId: req.authCredentials.id });
}

function uploadRequestImagesHandler(req) {
  return uploadRequestImages(this.serviceLocator, { files: req.body.files });
}

function getRequestHandler(req) {
  return getRequest(this.serviceLocator, req.params.requestId);
}

async function notificationsDisableHandler(req, reply) {
  await disableNotifications(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
  return reply.code(204).send();
}

function addProfileHandler(req) {
  const { userId, profileId } = req.body;
  return addProfile(this.serviceLocator, { userId, edsId: profileId });
}

module.exports = {
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
};
