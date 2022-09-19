const _ = require('ramda');

const sanitizeRequest = _.pick([
  'url',
  'hostname',
  'ip',
  'params',
  'method',
  'query',
  'sessionId',
  'headers',
  'body',
]);

module.exports = sanitizeRequest;
