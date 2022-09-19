const {
  geolocationSchema,
  suggestionSchema,
} = require('./schemas');

const {
  reverseGeocodingHandler,
  suggestAddressHandler,
} = require('./handlers');

const routes = (fastify, opts, done) => {
  fastify.get('/city-geolocate', { schema: geolocationSchema }, reverseGeocodingHandler);

  // Logged APIs
  fastify.register((_fastify, _opts, _done) => {
    _fastify
      .addHook('preHandler', _fastify.bearerAuth)
      .get('/suggest', { schema: suggestionSchema }, suggestAddressHandler);
    _done();
  });

  done();
};

module.exports = routes;
