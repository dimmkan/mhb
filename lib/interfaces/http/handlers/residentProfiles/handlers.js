const getResidentProfiles = require('application/use_cases/residentProfiles/getResidentProfiles');
const createResidentProfile = require('application/use_cases/residentProfiles/createResidentProfile');
const deleteResidentProfile = require('application/use_cases/residentProfiles/deleteResidentProfile');

const getUsers = require('application/use_cases/residentProfiles/users/getUsers');
const acceptUser = require('application/use_cases/residentProfiles/users/acceptUser');
const declineUser = require('application/use_cases/residentProfiles/users/declineUser');
const deleteUser = require('application/use_cases/residentProfiles/users/deleteUser');
const deleteAllUsers = require('application/use_cases/residentProfiles/users/deleteAllUsers');

const getIndications = require('application/use_cases/residentProfiles/operations/getIndications');
const createIndication = require('application/use_cases/residentProfiles/operations/createIndication');
const getPaymentLink = require('application/use_cases/residentProfiles/operations/getPaymentLink');
const getReceipt = require('application/use_cases/residentProfiles/operations/getReceipt');
const getMeashures = require('application/use_cases/residentProfiles/operations/getMeashures');
const getCharges = require('application/use_cases/residentProfiles/operations/getCharges');
const getPayments = require('application/use_cases/residentProfiles/operations/getPayments');
const getBalance = require('application/use_cases/residentProfiles/operations/getBalance');

const createIndicationTemporary = require('application/use_cases/residentProfiles/temporary/createIndication');
const uploadImages = require('application/use_cases/residentProfiles/uploadImages');

const getResidentProfile = require('application/use_cases/residentProfiles/getResidentProfile');

function getResidentProfilesHandler(req) {
  return getResidentProfiles(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

function createResidentProfileHandler(req) {
  return createResidentProfile(this.serviceLocator, {
    residentId: req.body.residentId,
    userId: req.authCredentials.id,
  });
}

async function deleteResidentProfileHandler(req, reply) {
  const { id } = req.params;
  await deleteResidentProfile(this.serviceLocator, { id });
  return reply.code(204).send();
}

async function getUsersHandler(req) {
  return getUsers(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

async function acceptUserHandler(req, reply) {
  const { id } = req.params;
  await acceptUser(this.serviceLocator, { id });
  return reply.code(204).send();
}

async function declineUserHandler(req, reply) {
  const { id } = req.params;
  await declineUser(this.serviceLocator, { id });
  return reply.code(204).send();
}

async function deleteUserHandler(req, reply) {
  const { id } = req.params;
  await deleteUser(this.serviceLocator, { id });
  return reply.code(204).send();
}

async function forceDeleteResidentProfileHandler(req, reply) {
  const { id } = req.params;
  await deleteAllUsers(this.serviceLocator, { id });
  await deleteResidentProfile(this.serviceLocator, { id });
  return reply.code(204).send();
}

async function getIndicationsHandler(req) {
  const { id } = req.params;
  return getIndications(this.serviceLocator, { id });
}

async function createIndicationHandler(req) {
  const { id } = req.params;
  const { id: indicationId, value, zone } = req.body;
  return createIndication(this.serviceLocator, {
    id, indicationId, value, zone,
  });
}

async function getPaymentLinkHandler(req) {
  const { id } = req.params;
  const { amount, type } = req.query;
  return getPaymentLink(this.serviceLocator, { id, amount, type });
}

async function getReceiptHandler(req, reply) {
  const { id } = req.params;
  const { date } = req.query;
  const receipt = await getReceipt(this.serviceLocator, { id, date });
  return reply
    .headers(receipt.info)
    .send(receipt.data);
}

async function getMeashuresHandler(req) {
  const { id } = req.params;
  return getMeashures(this.serviceLocator, { id });
}

async function getChargesHandler(req) {
  const { id } = req.params;
  return getCharges(this.serviceLocator, { id });
}

async function getPaymentsHandler(req) {
  const { id } = req.params;
  return getPayments(this.serviceLocator, { id });
}

async function getBalanceHandler(req) {
  const { id } = req.params;
  return getBalance(this.serviceLocator, { id });
}

async function createIndicationTemporaryHandler(req, reply) {
  const { id } = req.params;
  const {
    id: indicationId, value, zone, imageId,
  } = req.body;
  await createIndicationTemporary(this.serviceLocator, {
    id,
    indicationId,
    value,
    zone,
    imageId,
    userId: req.authCredentials.id,
  });
  return reply.code(204).send();
}

function uploadIndicationImageHandler(req) {
  return uploadImages(this.serviceLocator, req.body.file);
}

function getResidentProfileHandler(req) {
  const { id } = req.params;
  return getResidentProfile(this.serviceLocator, id);
}

module.exports = {
  getResidentProfilesHandler,
  createResidentProfileHandler,
  deleteResidentProfileHandler,
  forceDeleteResidentProfileHandler,

  getUsersHandler,
  acceptUserHandler,
  declineUserHandler,
  deleteUserHandler,

  getIndicationsHandler,
  createIndicationHandler,
  getPaymentLinkHandler,
  getReceiptHandler,
  getMeashuresHandler,
  getChargesHandler,
  getPaymentsHandler,
  getBalanceHandler,
  createIndicationTemporaryHandler,
  uploadIndicationImageHandler,
  getResidentProfileHandler,
};
