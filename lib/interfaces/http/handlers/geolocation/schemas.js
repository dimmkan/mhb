const lat = {
  type: 'number',
  description: 'Широта',
};
const lon = {
  type: 'number',
  description: 'Долгота',
};

const geolocationSchema = {
  deprecated: true,
  query: {
    type: 'object',
    properties: {
      lat,
      lon,
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
    400: {
      // errorCodes.VALIDATION
      type: 'object',
      description: 'Некорректный запрос',
    },
    404: {
      // errorCodes.NOT_FOUND
      type: 'object',
      description: 'Не удалось найти город или геолокация определила город не относящийся к обслуживаемым',
    },
    500: {
      // errorCodes.EXTERNAL
      type: 'object',
      description: 'Ошибка сервиса dadata',
    },
  },
  description: 'Метод для получения города по геолокации',
  tags: ['geolocation'],
};

module.exports = {
  geolocationSchema,
};
