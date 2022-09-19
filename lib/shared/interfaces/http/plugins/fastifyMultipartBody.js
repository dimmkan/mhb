const fastifyMultipart = require('@fastify/multipart');
const fp = require('fastify-plugin');

function isAllowMimetypes(allowMimetypes) {
  return allowMimetypes
    ? (mimetype) => allowMimetypes.indexOf(mimetype) !== -1
    : () => true;
}

function downloadAllowed({ allowed }) {
  const checkAllow = isAllowMimetypes(allowed);
  return function anon(part) {
    if (checkAllow(part.mimetype)) {
      return part.toBuffer();
    }
    return part.file.resume();
  };
}

function plugin(fastify, options, done) {
  fastify.register(fastifyMultipart, {
    ...options,
    attachFieldsToBody: true,
    onFile: downloadAllowed(options),
  });
  done();
}

module.exports = fp(plugin, {
  fastify: '>=3.0',
  name: 'fastify-multipart-body',
});
