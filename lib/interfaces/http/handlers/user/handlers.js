const _ = require('ramda');
const multipartToKeyValue = require('shared/utils/helper/multipartToKeyValue');

const getUser = require('application/use_cases/user/getUser');
const patchUserProfile = require('application/use_cases/user/patchUserProfile');
const changePassword = require('application/use_cases/user/changePassword');

const changePhone = require('application/use_cases/user/changePhone');
const changePhoneRequest = require('application/use_cases/user/changePhoneRequest');

const changeEmailRequest = require('application/use_cases/user/changeEmailRequest');
const changeEmail = require('application/use_cases/user/changeEmail');

const upsertAvatar = require('application/use_cases/user/upsertAvatar');
const upsertPassport = require('application/use_cases/user/upsertPassport');
const getPassport = require('application/use_cases/user/getPassport');
const getAvatar = require('application/use_cases/user/getAvatar');

const getFilteredUsersList = require('application/use_cases/user/getFilteredList');

const deleteAvatar = require('application/use_cases/user/deleteAvatar');
const deleteUser = require('application/use_cases/user/deleteUser');

async function getUserHandler(req) {
  return getUser(
    this.serviceLocator,
    req.authCredentials.id,
  );
}

async function patchProfileHandler(req, reply) {
  await patchUserProfile(this.serviceLocator, {
    userId: req.authCredentials.id,
    data: _.pick(['fullName', 'sex', 'birthday'], req.body),
  });
  return reply.code(204).send();
}

async function changePhoneHandler(req, reply) {
  await changePhone(this.serviceLocator, {
    userId: req.authCredentials.id,
    code: req.body.code,
  });
  return reply.code(204).send();
}

async function changePhoneRequestHandler(req, reply) {
  await changePhoneRequest(this.serviceLocator, {
    userId: req.authCredentials.id,
    phone: req.body.phone,
  });
  return reply.code(204).send();
}

async function changeEmailHandler(req, reply) {
  await changeEmail(this.serviceLocator, {
    userId: req.authCredentials.id,
    code: req.body.code,
  });
  return reply.code(204).send();
}

async function changeEmailRequestHandler(req, reply) {
  await changeEmailRequest(this.serviceLocator, {
    userId: req.authCredentials.id,
    email: req.body.email,
  });
  return reply.code(204).send();
}

async function changePasswordHandler(req, reply) {
  await changePassword(this.serviceLocator, {
    userId: req.authCredentials.id,
    password: req.body.password,
    newPassword: req.body.newPassword,
  });
  return reply.code(204).send();
}

async function avatarHandler(req, reply) {
  await upsertAvatar(this.serviceLocator, {
    ...req.body,
    userId: req.authCredentials.id,
  });
  return reply.code(204).send();
}

async function getAvatarHandler(req) {
  return getAvatar(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

async function passportHandler(req, reply) {
  await upsertPassport(this.serviceLocator, {
    ...multipartToKeyValue(req.body),
    file: req.body.file,
    userId: req.authCredentials.id,
  });
  return reply.code(204).send();
}

async function getPassportHandler(req) {
  return getPassport(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
}

function getFilteredUsersListHandler(req) {
  const { filters } = req.body;
  return getFilteredUsersList(this.serviceLocator, filters);
}

async function deleteAvatarHandler(req, reply) {
  await deleteAvatar(this.serviceLocator, {
    userId: req.authCredentials.id,
  });
  return reply.code(200).send({});
}

async function deleteUserHandler(req, reply) {
  await deleteUser(this.serviceLocator, { userId: req.authCredentials.id });
  return reply.code(200).send({ success: true });
}

module.exports = {
  getUserHandler,
  patchProfileHandler,
  changePasswordHandler,

  changePhoneHandler,
  changePhoneRequestHandler,

  changeEmailHandler,
  changeEmailRequestHandler,

  avatarHandler,
  passportHandler,

  getAvatarHandler,
  getPassportHandler,
  getFilteredUsersListHandler,
  deleteAvatarHandler,
  deleteUserHandler,
};
