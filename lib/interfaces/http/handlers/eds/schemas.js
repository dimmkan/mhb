const { errorCodes, openapiResponseError } = require('shared/errors');

const requestListSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  query: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        description: 'Номер страницы',
      },
      limit: {
        type: 'number',
        description: 'Количество элементов на странице',
      },
    },
    required: ['page', 'limit'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        pages: {
          type: 'object',
          properties: {
            all: { type: 'number' },
            pages: { type: 'number' },
            onpage: { type: 'number' },
          },
        },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения списка заявок в системе ЕДС',
  tags: ['eds'],
};

const categoriesListSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    200: {
      type: 'array',
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения списка категорий заявок в системе ЕДС',
  tags: ['eds'],
};

const uploadRequestImagesSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    properties: {
      files: {
        format: 'binary',
        description: 'Файлы, прикрепляемые к заявке',
      },
    },
    required: ['files'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        fileNamesArray: { type: 'array' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для загрузки файлов, привязываемых к заявке в системе ЕДС',
  tags: ['eds'],
};

const addRequestSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        description: 'Массив имен файлов, полученных методом /eds/request/images',
      },
      topic_id: {
        type: 'string',
        description: 'ID категории заявки',
      },
      description: {
        type: 'string',
        description: 'Описание заявки',
      },
      delayed_date: {
        type: 'string',
        description: 'Желаемая дата',
      },
      delayed_time: {
        type: 'string',
        description: 'Желаемое время',
      },
      city: {
        type: 'string',
        description: 'Город',
      },
      cityDistrict: {
        type: 'string',
        description: 'Район города',
      },
      street: {
        type: 'string',
        description: 'Наименование улицы',
      },
      streetType: {
        type: 'string',
        description: 'Тип улицы',
      },
      block: {
        type: 'string',
        description: 'Номер корпуса/строения',
      },
      blockType: {
        type: 'string',
        description: 'Тип корпуса/строения',
      },
      house: {
        type: 'string',
        minLength: 1,
        description: 'Номер дома',
      },
      entrance: {
        type: 'string',
        description: 'Подъезд',
      },
      flat: {
        type: 'string',
        description: 'Квартира',
      },
    },
    required: ['images',
      'topic_id',
      'description',
      'delayed_date',
      'delayed_time',
      'city',
      'street',
      'streetType',
      'house',
      'flat',
    ],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        topic_id: { type: 'string' },
        status: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        secondname: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        created: { type: 'string' },
        description: { type: 'string' },
        city: { type: 'string' },
        district: { type: 'string' },
        street: { type: 'string' },
        building: { type: 'string' },
        korpus: { type: 'string' },
        house: { type: 'string' },
        podezd: { type: 'string' },
        kvart: { type: 'string' },
        foto1: { type: 'string' },
        performer: { type: 'string' },
        create_on_site: { type: 'string' },
        subject: { type: 'string' },
        reason: { type: 'string' },
        delayed_date: { type: 'string' },
        closed_date: { type: 'string' },
        report_photos: { type: 'string' },
        user_confirm: { type: 'string' },
        foto2: { type: 'string' },
        foto3: { type: 'string' },
        foto4: { type: 'string' },
        foto5: { type: 'string' },
        foto6: { type: 'string' },
        foto7: { type: 'string' },
        foto8: { type: 'string' },
        foto9: { type: 'string' },
        foto10: { type: 'string' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для создания заявки в системе ЕДС',
  tags: ['eds'],
};

const requestConfirmSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      requestId: {
        type: 'string',
        description: 'ID заявки в системе ЕДС',
      },
    },
    required: ['requestId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        response: { type: 'string' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для подтверждения выполнения заявки в системе ЕДС',
  tags: ['eds'],
};

const requestRejectSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      requestId: {
        type: 'string',
        description: 'ID заявки в системе ЕДС',
      },
    },
    required: ['requestId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        response: { type: 'string' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для отклонения выполнения заявки в системе ЕДС',
  tags: ['eds'],
};

const shutdownsListCurrentSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    200: {
      type: 'array',
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения списка аварийных и текущих отключений для пользователя в системе ЕДС',
  tags: ['eds'],
};

const shutdownsListPlannedSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    200: {
      type: 'array',
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения списка плановых отключений для пользователя в системе ЕДС',
  tags: ['eds'],
};

const getRequestSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      requestId: {
        type: 'string',
        description: 'ID заявки в системе ЕДС',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        topic_id: { type: 'string' },
        topic_name: { type: 'string' },
        status: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        secondname: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        created: { type: 'string' },
        description: { type: 'string' },
        city: { type: 'string' },
        district: { type: 'string' },
        street: { type: 'string' },
        building: { type: 'string' },
        korpus: { type: 'string' },
        house: { type: 'string' },
        podezd: { type: 'string' },
        kvart: { type: 'string' },
        foto1: { type: 'string' },
        performer: { type: 'string' },
        create_on_site: { type: 'string' },
        subject: { type: 'string' },
        reason: { type: 'string' },
        delayed_date: { type: 'string' },
        delayed_time: { type: 'string' },
        closed_date: { type: 'string' },
        report_photos: { type: 'string' },
        user_confirm: { type: 'string' },
        foto2: { type: 'string' },
        foto3: { type: 'string' },
        foto4: { type: 'string' },
        foto5: { type: 'string' },
        foto6: { type: 'string' },
        foto7: { type: 'string' },
        foto8: { type: 'string' },
        foto9: { type: 'string' },
        foto10: { type: 'string' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.NOT_FOUND, { description: 'Не найдена заявка с таким номером' }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.EXTERNAL, { description: 'Ошибка сервиса ЕДС', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения данных заявки по ID в системе ЕДС',
  tags: ['eds'],
};

const notificationsDisableSchema = {
  security: [{ bearerAuth: [] }],
  description: 'Отключение уведомлений для приложения ЕДС',
  tags: ['eds'],
};

const addProfileSchema = {
  security: [{ apiKey: [] }],
  description: 'Связка учетной записи Наш Дом и ЕДС',
  tags: ['eds'],
  body: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'ID пользователя в системе Наш Дом',
      },
      profileId: {
        type: 'string',
        description: 'ID пользователя в системе ЕДС',
      },
    },
    required: ['userId', 'profileId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
    ),
  },
};

module.exports = {
  requestListSchema,
  categoriesListSchema,
  addRequestSchema,
  shutdownsListCurrentSchema,
  shutdownsListPlannedSchema,
  requestConfirmSchema,
  requestRejectSchema,
  uploadRequestImagesSchema,
  getRequestSchema,
  notificationsDisableSchema,
  addProfileSchema,
};
