const ATTACHMENT_MIME_TYPES = require('shared/entities/appealsAttachmentMimeTypes');
const env = require('infrastructure/config/env');
const {
  getFormData: getFormDataSchema,
  getAppeals: getAppealsSchema,
  createAppeal: createAppealSchema,
  putGrade: putGradeSchema,
} = require('./schemas');

const {
  getFormDataHandler,
  getAppealsHandler,
  createAppealHandler,
  putGradeHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify
    // eslint-disable-next-line global-require
    .register(require('shared/interfaces/http/plugins/fastifyMultipartBodyDisk'), {
      tmpdir: env.FILE_TEMP_DIR,
      limits: { files: 3, fileSize: 5e+6 },
      allow: ATTACHMENT_MIME_TYPES,
    })
    .register((_fastify, opts, _done) => {
      _fastify.addHook('preHandler', _fastify.bearerAuth);
      _fastify.get('/findByResidentId/:residentId', { schema: getAppealsSchema }, getAppealsHandler);
      _fastify.post('/', { schema: createAppealSchema }, createAppealHandler);
      _fastify.get('/new/findByResidentId/:residentId', { schema: getFormDataSchema }, getFormDataHandler);
      _fastify.post('/rate', { schema: putGradeSchema }, putGradeHandler);
      _done();
    });

  done();
};

module.exports = routes;
