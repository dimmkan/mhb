const axios = require('axios');
const _ = require('ramda');
const env = require('infrastructure/config/env');
const { AppError, errorCodes } = require('shared/errors');

const client = () => {
  const config = {
    baseURL: env.NEDOLZHNIK_EXT_PUBLIC_URL,
    timeout: 60000,
    headers: {
      'x-api-token': env.NEDOLZHNIK_EXT_TOKEN,
      accept: 'application/json',
    },
  };

  const errorInterceptor = _.compose(
    (errorBody) => { throw new AppError(errorBody); },
    _.mergeRight(errorCodes.EXTERNAL),
    _.objOf('description'),
    _.path(['response', 'data', 'message']),
  );

  const instance = axios.create(config);
  instance.interceptors.response.use(
    _.path(['data', 'data']),
    errorInterceptor,
  );

  const pureInstance = axios.create(config);
  pureInstance.interceptors.response.use(
    _.identity,
    errorInterceptor,
  );

  return {
    getManagingCompany: async (residentId) => instance(`accountsData/${residentId}/managementCompany`),

    getCharge: async (residentId) => instance(`accountsData/${residentId}/charge`),

    getAddress: async (residentId) => instance(`accountsData/${residentId}/address`),

    getMeashures: async (residentId) => instance(`accountsData/${residentId}/meashures`),

    getPayments: async (residentId) => instance(`accountsData/${residentId}/payments`),

    getIndications: async (residentId) => instance(`accountsData/${residentId}/indications`),

    getBalance: async (residentId) => instance(`accountsData/${residentId}/balance`),

    createIndication: async (residentId, {
      id, value, zone, name,
    }) => pureInstance.post(
      `accountsData/${residentId}/indications`,
      [[{
        id, last_indication: { epd: value }, zone, name,
      }]],
    ).then(_.path(['data', 0, 0])),

    getReceipt: async (residentId, { date = '' } = {}) => pureInstance(`accountsData/${residentId}/epd/${date}`, {
      responseType: 'stream',
    }).then(({ data, headers }) => ({
      data: data || {},
      info: _.pick(['content-disposition', 'content-type'], headers),
    })),

    getPaymentLink: async (residentId, {
      amount, email, phone, type,
    }) => instance(
      `accountsData/${residentId}/payment`,
      {
        params: {
          amount, email, phone, type,
        },
      },
    ),

  };
};

module.exports = client();
