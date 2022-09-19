const { VALIDATION: VALIDATION_ERROR_BODY } = require('shared/errors/errorCodes');
const errorResponseBody = require('./helpers/errorResponseBody');
const isUnusualError = require('./helpers/isUnusualError');
const sanitizeRequest = require('./helpers/sanitizeRequest');

module.exports = function prodHandler(error, request, reply) {
  const errorBody = (error.validation)
    ? errorResponseBody({
      ...VALIDATION_ERROR_BODY,
      meta: error.validation,
    })
    : errorResponseBody(error);

  errorBody.stack = undefined;
  errorBody.message = undefined;

  if (isUnusualError(error.status)) {
    this.log.error({
      err: { ...errorBody, req: sanitizeRequest(request) },
    });
  }

  return reply
    .code(errorBody.status)
    .type('application/json')
    .send(errorBody);
};
