/**
 * Схема для валидации
 * */
const {
  geolocationSchema,
} = require('./schemas');

/**
 * Хэндлер
 * */
const {
  reverseGeocodingHandler,
} = require('./handlers');

/**
 * Регистрация хэндлеров
 * */
const routes = (fastify, opts, done) => {
  fastify.get('/', { schema: geolocationSchema }, reverseGeocodingHandler);
  done();
};

module.exports = routes;
