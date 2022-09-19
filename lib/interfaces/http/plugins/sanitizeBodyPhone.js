const fp = require('fastify-plugin');
const parsePhoneNumber = require('shared/utils/helper/parsePhoneNumber');

function plugin(fastify, options, done) {
  fastify.decorate('sanitizeBodyPhone', (request, reply, next) => {
    if (request.body && 'phone' in request.body) {
      request.body.phone = parsePhoneNumber(request.body.phone);
    }
    next();
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-sanitize-body-phone',
});
