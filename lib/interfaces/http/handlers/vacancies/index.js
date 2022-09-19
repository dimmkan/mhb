const ATTACHMENT_MIME_TYPES = require('shared/entities/vacanciesAttachmentMimeTypes');
const env = require('infrastructure/config/env');
const {
  vacancyResponse: vacancyResponseSchema,
} = require('./schemas');

const {
  vacancyResponseHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // eslint-disable-next-line global-require
  fastify.register(require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk'), {
    tmpdir: env.FILE_TEMP_DIR,
    limits: { files: 3, fileSize: 5e+6 },
    allow: ATTACHMENT_MIME_TYPES,
  });
  fastify.route({
    method: 'POST',
    url: '/:vacancyId/response',
    schema: vacancyResponseSchema,
    preHandler: fastify.bearerAuthOrAnonym,
    handler: vacancyResponseHandler,
  });

  done();
};

module.exports = routes;
