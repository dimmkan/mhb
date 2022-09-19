const { AppError, errorCodes } = require('shared/errors');

const bearerFromHeaders = (headers) => {
  const authorizationHeader = (headers.authorization || headers.Authorization || '').toString();
  if (/^Bearer /i.test(authorizationHeader)) {
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[1].length) {
      return parts[1];
    }
  }
  throw new AppError(errorCodes.BAD_TOKEN);
};

module.exports = bearerFromHeaders;
