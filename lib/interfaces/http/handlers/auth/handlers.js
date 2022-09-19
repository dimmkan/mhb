/** Auth UseCases */
const verifyUniquePhoneOrEmail = require('application/use_cases/auth/verifyUniquePhoneOrEmail');
const registrationRequest = require('application/use_cases/auth/registrationRequest');
const registration = require('application/use_cases/auth/registration');
const resetPasswordEmail = require('application/use_cases/auth/resetPasswordEmail');
const resetPasswordEmailRequest = require('application/use_cases/auth/resetPasswordEmailRequest');
const resetPasswordPhone = require('application/use_cases/auth/resetPasswordPhone');
const resetPasswordPhoneRequest = require('application/use_cases/auth/resetPasswordPhoneRequest');

/** Token UseCases */
const createTokens = require('application/use_cases/token/createTokens');
const refreshTokens = require('application/use_cases/token/refreshTokens');
const deleteTokenUser = require('application/use_cases/token/deleteTokenUser');

/** ResidentProfiles UseCases */
const createResidentProfile = require('application/use_cases/residentProfiles/createResidentProfile');

/** Eds UseCases */
const createEdsProfile = require('application/use_cases/eds/createEdsProfile');

/** EdsServices UseCases */
const createEdsServicesProfile = require('application/use_cases/edsServices/createProfile');

/** Services UseCases */
const getResidentProfileAddress = require('application/use_cases/serviceMethods/getResidentProfileAddress');

function verifyUniquePhoneOrEmailHandler(req) {
  return verifyUniquePhoneOrEmail(this.serviceLocator, req.body);
}

function refreshHandler({ serviceLocator }) {
  const refreshTokenInstance = refreshTokens(serviceLocator);
  return async (req) => refreshTokenInstance({
    token: req.body.refreshToken,
    ipAddress: req.ip,
    agent: req.headers['user-agent'],
  });
}

function loginHandler({ serviceLocator }) {
  const createTokensInstance = createTokens(serviceLocator);
  return async (req) => createTokensInstance({
    userId: req.authCredentials.id,
    ipAddress: req.ip,
    agent: req.headers['user-agent'],
  });
}

async function logoutHandler(req, reply) {
  const { rId, id } = req.authCredentials;
  await deleteTokenUser(this.serviceLocator, rId, id);
  return reply.code(204).send();
}

function registrationHandler({ serviceLocator }) {
  const createTokensInstance = createTokens(serviceLocator);
  return async ({ body, headers, ip }) => {
    const { userId, residentId, ...userMeta } = await registration(serviceLocator, body);
    await createResidentProfile(serviceLocator, { residentId, userId });

    const address = await getResidentProfileAddress(serviceLocator, residentId);

    await Promise.allSettled([
      createEdsProfile(serviceLocator, { userId, ...userMeta, address }),
      createEdsServicesProfile(serviceLocator, { userId, ...userMeta, address }),
    ]);

    return createTokensInstance({
      userId,
      ipAddress: ip,
      agent: headers['user-agent'],
    });
  };
}

async function registrationRequestHandler(req, reply) {
  await registrationRequest(this.serviceLocator, req.body);
  return reply.code(204).send();
}

async function resetPasswordEmailRequestHandler(req, reply) {
  await resetPasswordEmailRequest(this.serviceLocator, req.body);
  return reply.code(204).send();
}
async function resetPasswordEmailHandler(req, reply) {
  await resetPasswordEmail(this.serviceLocator, req.body);
  return reply.code(204).send();
}
async function resetPasswordPhoneRequestHandler(req, reply) {
  await resetPasswordPhoneRequest(this.serviceLocator, req.body);
  return reply.code(204).send();
}
async function resetPasswordPhoneHandler(req, reply) {
  await resetPasswordPhone(this.serviceLocator, req.body);
  return reply.code(204).send();
}

module.exports = {
  loginHandler,
  logoutHandler,
  registrationHandler,
  registrationRequestHandler,
  verifyUniquePhoneOrEmailHandler,
  refreshHandler,
  resetPasswordEmailRequestHandler,
  resetPasswordEmailHandler,
  resetPasswordPhoneRequestHandler,
  resetPasswordPhoneHandler,
};
