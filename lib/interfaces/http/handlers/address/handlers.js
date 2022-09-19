const getCityByCoordinate = require('application/use_cases/address/getCityByCoordinate');
const suggest = require('application/use_cases/address/suggest');

function reverseGeocodingHandler(req) {
  return getCityByCoordinate(this.serviceLocator, req.query);
}

function suggestAddressHandler(req) {
  const { search } = req.query;
  return suggest(this.serviceLocator, { str: search });
}

module.exports = {
  reverseGeocodingHandler,
  suggestAddressHandler,
};
