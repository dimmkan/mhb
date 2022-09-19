const bearerAuth = {
  headers: {
    properties: {
      Authorization: {
        type: 'string',
        minLength: 10,
      },
    },
    required: ['Authorization'],
  },
};

const apiKeyAuth = {
  headers: {
    properties: {
      Token: {
        type: 'string',
        minLength: 10,
      },
    },
    required: ['Token'],
  },
};

module.exports = {
  bearerAuth,
  apiKeyAuth,
};
