const {
  getFormData: getFormDataSchema,
  getAppointments: getAppointmentsSchema,
  createAppointment: createAppointmentSchema,
  cancelAppointment: cancelAppointmentSchema,
  putGrade: putGradeSchema,
  putGradeWebhook: putGradeWebhookSchema,
} = require('./schemas');

const {
  getFormDataHandler,
  getAppointmentsHandler,
  createAppointmentHandler,
  cancelAppointmentHandler,
  putGradeHandler,
  putGradeWebhookHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  // Logged APIs
  fastify.register((_fastify, opts, _done) => {
    _fastify.addHook('preHandler', _fastify.bearerAuth);
    _fastify.get('/findByResidentId/:residentId', { schema: getAppointmentsSchema }, getAppointmentsHandler);
    _fastify.post('/', { schema: createAppointmentSchema }, createAppointmentHandler);
    _fastify.delete('/', { schema: cancelAppointmentSchema }, cancelAppointmentHandler);
    _fastify.get('/new/findByResidentId/:residentId', { schema: getFormDataSchema }, getFormDataHandler);
    _fastify.post('/rate', { schema: putGradeSchema }, putGradeHandler);
    _done();
  });

  fastify.route({
    method: 'POST',
    url: '/rateWebhook',
    schema: putGradeWebhookSchema,
    preHandler: [fastify.apiKeyAuth],
    handler: putGradeWebhookHandler,
  });

  done();
};

module.exports = routes;
