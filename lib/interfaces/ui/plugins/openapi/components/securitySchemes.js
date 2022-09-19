module.exports = {
  apiKey: {
    type: 'apiKey',
    name: 'token',
    in: 'header',
  },
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};
