/** Юзкейс получения города по геолокации */
const getCityByCoordinate = require('application/use_cases/geolocation/getCityByCoordinate');

/** Контроллер получения города по геолокации */
function reverseGeocodingHandler(req) {
  return getCityByCoordinate(this.serviceLocator, req.query);
}

module.exports = { reverseGeocodingHandler };
