const { errorCodes, openapiResponseError } = require('shared/errors');

const geolocationSchema = {
  description: 'Метод для получения города по геолокации',
  tags: ['address'],
  query: {
    type: 'object',
    properties: {
      lat: {
        type: 'number',
        description: 'Широта',
      },
      lon: {
        type: 'number',
        description: 'Долгота',
      },
    },
    required: ['lat', 'lon'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { description: 'Ошибка валидации', additional: { meta: [] } }],
      [errorCodes.NOT_FOUND, { description: 'Не удалось найти город или геолокация определила город не относящийся к обслуживаемым' }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса dadata', additional: { message: 'string' } }],
    ),
  },
};

const suggestionSchema = {
  description: 'suggestionSchema',
  security: [{ bearerAuth: [] }],
  tags: ['address'],
  query: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'Строка поиска адреса',
        example: 'Королев д 3',
      },
    },
    required: ['search'],
  },
};

module.exports = {
  geolocationSchema,
  suggestionSchema,
};
