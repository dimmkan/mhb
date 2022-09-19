const createInvitationUseCase = require('application/use_cases/loyalty/createInvitation');
const cashoutInvitationUseCase = require('application/use_cases/loyalty/cashoutInvitation');

const closeOperationUseCase = require('application/use_cases/loyalty/closeOperation');
const userPointsUseCase = require('application/use_cases/loyalty/userPoints');
const userPointsDetailedUseCase = require('application/use_cases/loyalty/userPointsDetailed');

const createOperationAdminUseCase = require('application/use_cases/loyalty/createOperationAdmin');
const operationTypesAdminUseCase = require('application/use_cases/loyalty/operationTypesAdmin');

const createOperationExternalUseCase = require('application/use_cases/loyalty/createOperationExternal');
const pointsExternalUseCase = require('application/use_cases/loyalty/pointsExternal');
const pointsDetailedExternalUseCase = require('application/use_cases/loyalty/pointsDetailedExternal');

const getInvitations = require('application/use_cases/loyalty/getInvitations');
const getUsersActions = require('application/use_cases/loyalty/getUsersActions');

async function createInvitationHandler(req) {
  return createInvitationUseCase(this.serviceLocator, {
    ...req.body,
    userId: req.authCredentials.id,
  });
}
function cashoutInvitationHandler(req) {
  return cashoutInvitationUseCase(this.serviceLocator, {
    userId: req.authCredentials.id,
    hash: req.body.hash,
  });
}

async function closeOperationHandler(req, reply) {
  await closeOperationUseCase(this.serviceLocator, req.body);
  return reply.code(204).send();
}

function userPointsHandler(req) {
  return userPointsUseCase(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

function userPointsDetailedHandler(req) {
  const { page, limit } = req.query;
  return userPointsDetailedUseCase(this.serviceLocator, {
    userId: req.authCredentials.id,
    page: page || 1,
    limit: limit || 10,
  });
}

function createInvitationAdminHandler(req) {
  return createInvitationUseCase(this.serviceLocator, req.body);
}

async function createOperationAdminHandler(req, reply) {
  await createOperationAdminUseCase(this.serviceLocator, req.body);
  return reply.code(204).send();
}

function operationTypesAdminHandler() {
  return operationTypesAdminUseCase(this.serviceLocator);
}

async function createOperationExternalHandler(req, reply) {
  await createOperationExternalUseCase(this.serviceLocator, req.body);
  return reply.code(204).send();
}

function pointsExternalHandler(req) {
  return pointsExternalUseCase(this.serviceLocator, req.query);
}

function pointsDetailedExternalHandler(req) {
  return pointsDetailedExternalUseCase(this.serviceLocator, req.query);
}

function getInvitationsHandler(req) {
  const { filters } = req.body;
  return getInvitations(this.serviceLocator, filters);
}

function getUsersActionsHandler(req) {
  const { filters } = req.body;
  return getUsersActions(this.serviceLocator, filters);
}

module.exports = {
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
};
