const user = require('./user');
const userInvitation = require('./userInvitation');
const admin = require('./admin');
const adminInvitation = require('./adminInvitation');
const external = require('./external');

module.exports = Object.freeze({
  user,
  admin,
  external,
  userInvitation,
  adminInvitation,
  all: Object.freeze({
    ...user,
    ...admin,
    ...external,
    ...userInvitation,
    ...adminInvitation,
  }),
});
