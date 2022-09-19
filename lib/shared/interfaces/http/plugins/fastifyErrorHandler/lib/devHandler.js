const stdout = require('stdout-stream');
const stackTrace = require('stack-trace');
const { omit } = require('ramda');
const { VALIDATION: VALIDATION_ERROR_BODY } = require('shared/errors/errorCodes');
const errorResponseBody = require('./helpers/errorResponseBody');
const sanitizeRequest = require('./helpers/sanitizeRequest');
const isUnusualError = require('./helpers/isUnusualError');

module.exports = function devHandler(error, request, reply) {
  const errorBody = (error.validation)
    ? errorResponseBody({
      ...VALIDATION_ERROR_BODY,
      meta: error.validation,
    })
    : errorResponseBody(error);

  if (isUnusualError(error.status)) errorBody.stack = stackTrace.parse(error);

  this.log.error({
    err: { ...omit(['stack'], errorBody), req: sanitizeRequest(request) },
  });

  if (error.stack) {
    stdout.write('--------------- ERROR STACK BEGIN --------------\n');
    stdout.write(`${new Date()} env:dev/regular error\n`);
    stdout.write(error.stack);
    stdout.write('\n---------------- ERROR STACK END ---------------\n\n');
  }

  return reply
    .code(errorBody.status)
    .type('application/json')
    .send(errorBody);
};
