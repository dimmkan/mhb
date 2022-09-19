const regenerateEds = require('application/use_cases/serviceMethods/regenerateEds');

async function regenerateEdsHandler(req, reply) {
  await regenerateEds(this.serviceLocator);
  return reply.code(204).send();
}

module.exports = {
  regenerateEdsHandler,
};
