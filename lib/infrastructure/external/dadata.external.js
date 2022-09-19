const axios = require('axios');
const _ = require('ramda');
const first = require('shared/utils/helper/first');
const throwIs = require('shared/utils/helper/throwIs');
const env = require('infrastructure/config/env');

const pickAddressPayload = _.pick(
  [
    'qc',
    'fias_id',
    'fias_actuality_state',
    'source',
    'result',
    'region', 'region_type',
    'city', 'city_type',
    'city_district', 'city_district_type',
    'street', 'street_type',
    'settlement', 'settlement_type',
    'house', 'house_type',
    'block', 'block_type',
    'flat', 'flat_type',
  ],
);

const throwNotFoundIsNilOrEmpty = throwIs(_.anyPass([_.isEmpty, _.isNil]), 'Not found');

const client = () => {
  const instance = axios.create({
    timeout: 60000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${env.DADATA_EXT_TOKEN}`,
    },
  });

  instance.interceptors.response.use(
    _.prop('data'),
    _.path(['response', 'data']),
  );

  const cleanAddress = (addresses) => instance({
    url: `${env.DADATA_CLEANER_EXT_PUBLIC_URL}/api/v1/clean/address`,
    method: 'post',
    data: [addresses].flat(1),
    headers: {
      'X-Secret': env.DADATA_EXT_SECRET,
    },
  })
    .then(
      _.compose(
        pickAddressPayload,
        throwNotFoundIsNilOrEmpty,
        first,
      ),
    );

  const reverseGeocoding = (lat, lon) => instance({
    url: `${env.DADATA_SUGGESTIONS_EXT_PUBLIC_URL}/api/4_1/rs/geolocate/address`,
    params: {
      lat,
      lon,
      count: 1,
    },
  }).then(_.compose(
    throwNotFoundIsNilOrEmpty,
    _.path(['suggestions', 0, 'data']),
  ));

  const suggestionsAddress = (query) => instance({
    url: `${env.DADATA_SUGGESTIONS_EXT_PUBLIC_URL}/api/4_1/rs/suggest/address`,
    method: 'post',
    data: {
      locations_boost: [{ kladr_id: '7400000100000' }],
      locations: [
        { city: 'Москва' },
        { city: 'Королев' },
        { city: 'Реутов' },
        { city: 'Балашиха' },
        { city: 'Лыткарино' },
        { city: 'Ивантеевка' },
      ],
      restrict_value: false,
      query,
      count: 8,
      from_bound: { value: 'region' },
      to_bound: { value: 'house' },
    },
  });

  const findById = (query) => instance({
    url: `${env.DADATA_SUGGESTIONS_EXT_PUBLIC_URL}/api/4_1/rs/findById/address`,
    method: 'post',
    data: query,
  }).then(_.compose(
    throwNotFoundIsNilOrEmpty,
    _.path(['suggestions', 0, 'data']),
  ));

  return {
    cleanAddress,
    reverseGeocoding,
    suggestionsAddress,
    findById,
  };
};

module.exports = client();
