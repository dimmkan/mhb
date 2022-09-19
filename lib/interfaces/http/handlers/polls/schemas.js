const residentId = {
  type: 'string',
  description: 'Лицевой счет',
};

const vote = {
  tags: ['polls'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      residentId,
      pollId: { type: 'number', description: 'ID опроса' },
      answers: {
        type: 'array',
        description: 'Массив ID ответов опроса',
        items: { type: 'number' },
      },
    },
    required: ['residentId', 'pollId', 'answers'],
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          answer: { type: 'number' },
          count: { type: 'number' },
          percent: { type: 'number' },
          selected: { type: 'boolean' },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Некорректный запрос',
    },
    500: {
      // errorCodes.EXTERNAL
      // errorCodes.SERVER
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Голосование в опросе',
};

const getUserAnswersByResidentId = {
  tags: ['polls'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      residentId,
    },
    required: ['residentId'],
  },
  query: {
    type: 'object',
    properties: {
      ids: {
        type: 'string',
        description: 'ID опросов через запятую',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              answers: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Некорректный запрос',
    },
    500: {
      // errorCodes.EXTERNAL
      // errorCodes.SERVER
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Получение ответов пользователя на опросы',
};

const getPollAnswersCountersWebhook = {
  tags: ['polls'],
  security: [
    {
      apiKey: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      pollId: {
        type: 'string',
        description: 'ID опроса',
      },
    },
    required: ['pollId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              answer: { type: 'number' },
              count: { type: 'number' },
            },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Некорректный запрос',
    },
    500: {
      // errorCodes.EXTERNAL
      // errorCodes.SERVER
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Вебхук для получения количества голосов опроса по ответам',
};

const getResultsWebhook = {
  tags: ['polls'],
  security: [
    {
      apiKey: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      pollId: {
        type: 'string',
        description: 'ID опроса',
      },
    },
    required: ['pollId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              answers: { type: 'array', items: { type: 'string' } },
              date: { type: 'string', format: 'date' },
            },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Некорректный запрос',
    },
    500: {
      // errorCodes.EXTERNAL
      // errorCodes.SERVER
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Вебхук для получения полной выгрузки результатов опроса',
};

module.exports = {
  vote,
  getUserAnswersByResidentId,
  getPollAnswersCountersWebhook,
  getResultsWebhook,
};
