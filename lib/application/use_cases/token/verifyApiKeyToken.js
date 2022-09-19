const { AppError, errorCodes } = require('shared/errors');
const { API_KEYS } = require('infrastructure/config/env');

const verifyApiKeyToken = (apiKey) => {
  if (API_KEYS.includes(apiKey)) {
    return { apiKey };
  }
  throw new AppError(errorCodes.BAD_TOKEN);
};

module.exports = verifyApiKeyToken;
