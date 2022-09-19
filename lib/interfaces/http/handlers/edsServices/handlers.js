const requests = require('application/use_cases/edsServices/requests');
const request = require('application/use_cases/edsServices/request');
const createRequest = require('application/use_cases/edsServices/createRequest');
const bonuses = require('application/use_cases/edsServices/bonuses');
const paymentUrl = require('application/use_cases/edsServices/paymentUrl');
const disableNotifications = require('application/use_cases/edsServices/disableNotifications');
const categoriesWithPrice = require('application/use_cases/edsServices/categoriesWithPrice');
const uploadImages = require('application/use_cases/edsServices/uploadImages');
const addProfile = require('application/use_cases/edsServices/addProfile');

function createRequestHandler(req) {
  return createRequest(this.serviceLocator, {
    ...req.body,
    userId: req.authCredentials.id,
  });
}

function requestsHandler(req) {
  return requests(this.serviceLocator, {
    ...req.query,
    userId: req.authCredentials.id,
  });
}

function requestHandler(req) {
  return request(this.serviceLocator, {
    id: req.params.id,
    userId: req.authCredentials.id,
  });
}

function requestsCategoriesWithPriceHandler() {
  return categoriesWithPrice(this.serviceLocator);
}

function requestsPaymentUrlHandler(req) {
  return paymentUrl(this.serviceLocator, {
    ...req.query,
    id: req.params.id,
    userId: req.authCredentials.id,
  });
}

async function notificationsDisableHandler(req, reply) {
  await disableNotifications(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
  return reply.code(204).send();
}

function bonusesHandler(req) {
  return bonuses(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

function uploadImagesHandler(req) {
  return uploadImages(this.serviceLocator, {
    userId: req.authCredentials.id,
    files: req.body.files,
  });
}

function addProfileHandler(req) {
  const { userId, profileId } = req.body;
  return addProfile(this.serviceLocator, { userId, edsServicesId: profileId });
}

module.exports = {
  createRequestHandler,
  requestHandler,
  requestsHandler,
  requestsCategoriesWithPriceHandler,
  requestsPaymentUrlHandler,
  notificationsDisableHandler,
  bonusesHandler,
  uploadImagesHandler,
  addProfileHandler,
};
