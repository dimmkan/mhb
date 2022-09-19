const {
  getGenegalInformationSchema,
  downloadInvoiceSchema,
  getPeriodListSchema,
  getManagingReportSchema,
} = require('./schemas');

const {
  getGeneralInformationHandler,
  downloadInvoiceHandler,
  getPeriodListHandler,
  getManagingReportHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.register((_fastify, _opts, _done) => {
    const {
      residentProfile: {
        roles,
        withRoleHandler,
      },
    } = fastify;

    const isUserRole = withRoleHandler([roles.USER]);

    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .addHook('preHandler', isUserRole)
      .get('/information/by-resident-profile/:id', { schema: getGenegalInformationSchema }, getGeneralInformationHandler)
      .get('/download/invoice/by-resident-profile/:id', { schema: downloadInvoiceSchema }, downloadInvoiceHandler)
      .get('/periodlist/by-resident-profile/:id', { schema: getPeriodListSchema }, getPeriodListHandler)
      .get('/managingreport/by-resident-profile/:id', { schema: getManagingReportSchema }, getManagingReportHandler);

    _done();
  });

  done();
};

module.exports = routes;
