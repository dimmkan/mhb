const fp = require('fastify-plugin');
const { withRole, roles } = require('application/use_cases/residentProfiles/permissions/withRole');
const verifyResidentId = require('application/use_cases/residentProfiles/permissions/verifyResidentId');

const verifyResidentIdHandler = ({ serviceLocator }) => (req) => {
  const { residentId, paidByReceipt } = req.body;
  return verifyResidentId(serviceLocator, { residentId, paidByReceipt });
};

const withRoleHandler = ({ serviceLocator }) => (rolesOpts) => {
  const checkRole = withRole(serviceLocator, rolesOpts);
  return async function handle(req) {
    await checkRole({
      id: req.params.id,
      userId: req.authCredentials.id,
    });
  };
};

function plugin(fastify, options, done) {
  fastify.decorate('residentProfile', {
    verifyResidentIdHandler: verifyResidentIdHandler(fastify),
    withRoleHandler: withRoleHandler(fastify),
    roles,
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-resident-profile',
});
