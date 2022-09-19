const axios = require('axios');
const _ = require('ramda');
const first = require('shared/utils/helper/first');
const throwIs = require('shared/utils/helper/throwIs');
const env = require('infrastructure/config/env');

const client = () => {
  const instance = axios.create({
    baseURL: env.MANAGING_EXT_PUBLIC_URL,
    timeout: 60000,
    headers: {
      accept: 'application/json',
    },
  });

  instance.interceptors.response.use(
    _.compose(throwIs(_.isEmpty, 'Not found'), _.path(['data', 'data'])),
  );

  const defaultRequestParams = { fields: 'id' };

  return {
    // getByNId: async () => ({ id: 3 }),

    getByNId: (NId, { fields } = defaultRequestParams) => instance.request({
      url: '/',
      params: {
        'filter[nedolzhnikId][_eq]': NId,
        fields,
      },
    }).then(first),

    get: (id, { fields } = defaultRequestParams) => instance.request({
      url: `/${id}`,
      params: { fields },
    }),

  };
};

module.exports = client();
