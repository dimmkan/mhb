const { errorCodes, openapiResponseError } = require('shared/errors');

const receiveFCMTokenSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      FCMToken: {
        type: 'string',
        description: 'FCM-токен мобильного устройства',
      },
    },
    required: ['FCMToken'],
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
  description: 'Метод для привязки токена мобильного устройства к пользователю',
  tags: ['notifications'],
};

const listNotificationSchema = {
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
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        metadata: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для получения списка уведомлений',
  tags: ['notifications'],
};

const markReadNotificationSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      messageId: {
        type: 'number',
        description: 'ID уведомления в системе',
      },
    },
    required: ['messageId'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для пометки уведомления как прочитанного',
  tags: ['notifications'],
};

const addNotificationByUserSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      phone: {
        type: 'string',
        description: 'Номер телефона пользователя, которому отправляется уведомление',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'E-mail пользователя, которому отправляется уведомление',
      },
      title: {
        type: 'string',
        description: 'Заголовок уведомления',
      },
      body: {
        type: 'string',
        description: 'Текст уведомления',
      },
      file: {
        type: 'string',
        description: 'Идентификатор файла в админке',
      },
    },
    required: ['phone', 'body'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для отправки уведомления из админки отдельному пользователю',
  tags: ['notifications'],
};

const addByAddressOssNotificationSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            nullable: true,
            description: 'Наименование города',
          },
          cityType: {
            type: 'string',
            nullable: true,
            description: 'Тип города',
          },
          cityDistrict: {
            type: 'string',
            nullable: true,
            description: 'Наименование района',
          },
          cityDistrictType: {
            type: 'string',
            nullable: true,
            description: 'Тип района',
          },
          street: {
            type: 'string',
            nullable: true,
            description: 'Наименование улицы',
          },
          streetType: {
            type: 'string',
            nullable: true,
            description: 'Тип улицы',
          },
          settlement: {
            type: 'string',
            nullable: true,
            description: 'Наименование поселка',
          },
          settlementType: {
            type: 'string',
            nullable: true,
            description: 'Тип поселка',
          },
          house: {
            type: 'string',
            nullable: true,
            description: 'Номер дома',
          },
          houseType: {
            type: 'string',
            nullable: true,
            description: 'Тип дома',
          },
          block: {
            type: 'string',
            nullable: true,
            description: 'Корпус/строение',
          },
          blockType: {
            type: 'string',
            nullable: true,
            description: 'Тип корпуса/строения',
          },
        },
        required: ['city',
          'cityType',
          'cityDistrict',
          'cityDistrictType',
          'street',
          'streetType',
          'settlement',
          'settlementType',
          'house',
          'houseType',
          'block',
          'blockType',
        ],
      },
      payload: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Тема собрания',
          },
          endDate: {
            type: 'string',
            description: 'Дата окончания',
          },
          meetingLink: {
            type: 'string',
            description: 'Ссылка на онлайн-собрание',
          },
        },
        required: ['subject', 'endDate'],
      },
    },
    required: ['address', 'payload'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для отправки уведомления из админки об ОСС по адресу',
  tags: ['notifications'],
};

const addByAddressNotificationSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            nullable: true,
            description: 'Наименование города',
          },
          cityType: {
            type: 'string',
            nullable: true,
            description: 'Тип города',
          },
          cityDistrict: {
            type: 'string',
            nullable: true,
            description: 'Наименование района',
          },
          cityDistrictType: {
            type: 'string',
            nullable: true,
            description: 'Тип района',
          },
          street: {
            type: 'string',
            nullable: true,
            description: 'Наименование улицы',
          },
          streetType: {
            type: 'string',
            nullable: true,
            description: 'Тип улицы',
          },
          settlement: {
            type: 'string',
            nullable: true,
            description: 'Наименование поселка',
          },
          settlementType: {
            type: 'string',
            nullable: true,
            description: 'Тип поселка',
          },
          house: {
            type: 'string',
            nullable: true,
            description: 'Номер дома',
          },
          houseType: {
            type: 'string',
            nullable: true,
            description: 'Тип дома',
          },
          block: {
            type: 'string',
            nullable: true,
            description: 'Корпус/строение',
          },
          blockType: {
            type: 'string',
            nullable: true,
            description: 'Тип корпуса/строения',
          },
          flat: {
            type: 'string',
            nullable: true,
            description: 'Номер квартиры',
          },
          flatType: {
            type: 'string',
            nullable: true,
            description: 'Тип квартиры',
          },
        },
        required: ['city',
          'cityType',
          'cityDistrict',
          'cityDistrictType',
          'street',
          'streetType',
          'settlement',
          'settlementType',
          'house',
          'houseType',
          'block',
          'blockType',
        ],
      },
      payload: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Заголовок уведомления',
          },
          body: {
            type: 'string',
            description: 'Текст уведомления',
          },
          file: {
            type: 'string',
            description: 'Идентификатор файла в админке',
          },
          itemId: {
            type: 'string',
            description: 'Идентификатор опроса',
          },
          notificationType: {
            type: 'string',
            description: 'Тип уведомления (для опроса)',
          },
        },
        required: ['title', 'body'],
      },
    },
    required: ['address', 'payload'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для отправки уведомления из админки об ОСС по адресу',
  tags: ['notifications'],
};

const addByManagingCompanyNotificationSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      managingCompanyId: {
        type: 'string',
        description: 'Идентификатор управляющей компании в системе',
      },
      title: {
        type: 'string',
        description: 'Заголовок уведомления',
      },
      body: {
        type: 'string',
        description: 'Текст уведомления',
      },
      file: {
        type: 'string',
        description: 'Идентификатор файла в админке',
      },
      itemId: {
        type: 'string',
        description: 'Идентификатор опроса',
      },
      notificationType: {
        type: 'string',
        description: 'Тип уведомления (для опроса)',
      },
    },
    required: ['managingCompanyId', 'body'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для отправки уведомления из админки нескольким пользователям по id УК',
  tags: ['notifications'],
};

const notificationEdsChangeRequestStatusSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС',
      },
      item_id: {
        type: 'number',
        description: 'Идентификатор заявки в системе ЕДС',
      },
      description: {
        type: 'string',
        description: 'Описание заявки в системе ЕДС',
      },
      category: {
        type: 'string',
        description: 'Категория заявки в системе ЕДС',
      },
      status: {
        type: 'string',
        description: 'Статус заявки в системе ЕДС',
      },
    },
    required: ['user_id', 'item_id', 'description', 'status'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений об изменении статуса заявки в системе ЕДС',
  tags: ['notifications'],
};

const notificationEdsRequestDoneSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС',
      },
      item_id: {
        type: 'number',
        description: 'Идентификатор заявки в системе ЕДС',
      },
      description: {
        type: 'string',
        description: 'Описание заявки в системе ЕДС',
      },
      category: {
        type: 'string',
        description: 'Категория заявки в системе ЕДС',
      },
    },
    required: ['user_id', 'item_id', 'description'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений о выполнении заявки в системе ЕДС',
  tags: ['notifications'],
};

const notificationEdsPlanningShutdownSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС',
      },
      theme: {
        type: 'string',
        description: 'Тема оповещения',
      },
      reason: {
        type: 'string',
        description: 'Причина отключения',
      },
      subject_resource: {
        type: 'string',
        description: 'Отключаемый ресурс',
      },
      planed_start_date: {
        type: 'string',
        description: 'Дата начала отключения',
      },
      planed_end_date: {
        type: 'string',
        description: 'Дата окончания отключения',
      },
      created: {
        type: 'string',
        description: 'Дата создания оповещения',
      },
      notify: {
        type: 'string',
        description: 'Текстовое описание оповещения',
      },
      city: {
        type: 'string',
        description: 'Город отключения',
      },
      district: {
        type: 'string',
        description: 'Район отключения',
      },
      street: {
        type: 'string',
        description: 'Улица отключения',
      },
      house: {
        type: 'string',
        description: 'Дом отключения',
      },
    },
    required: ['user_id',
      'city',
      'district',
      'street',
      'house',
      'planed_start_date',
      'subject_resource',
      'planed_end_date',
    ],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений о плановых отключениях (ЕДС)',
  tags: ['notifications'],
};

const notificationEdsEmergencyShutdownSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС',
      },
      theme: {
        type: 'string',
        description: 'Тема оповещения',
      },
      reason: {
        type: 'string',
        description: 'Причина отключения',
      },
      subject_resource: {
        type: 'string',
        description: 'Отключаемый ресурс',
      },
      planed_start_date: {
        type: 'string',
        description: 'Дата начала отключения',
      },
      planed_end_date: {
        type: 'string',
        description: 'Дата окончания отключения',
      },
      created: {
        type: 'string',
        description: 'Дата создания оповещения',
      },
      notify: {
        type: 'string',
        description: 'Текстовое описание оповещения',
      },
      city: {
        type: 'string',
        description: 'Город отключения',
      },
      district: {
        type: 'string',
        description: 'Район отключения',
      },
      street: {
        type: 'string',
        description: 'Улица отключения',
      },
      house: {
        type: 'string',
        description: 'Дом отключения',
      },
    },
    required: ['user_id',
      'city',
      'district',
      'street',
      'house',
      'planed_start_date',
      'subject_resource',
      'planed_end_date',
    ],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений об аварийных отключениях (ЕДС)',
  tags: ['notifications'],
};

const notificationEdsServiceChangeRequestSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС.Услуги',
      },
      item_id: {
        type: 'number',
        description: 'Идентификатор заявки в системе ЕДС.Услуги',
      },
      description: {
        type: 'string',
        description: 'Описание заявки в системе ЕДС.Услуги',
      },
      route: {
        type: 'string',
        description: 'Тип заявки в системе ЕДС.Услуги',
      },
      sum: {
        type: 'number',
        description: 'Сумма заявки в системе ЕДС.Услуги',
      },
      category: {
        type: 'string',
        description: 'Категория заявки в системе ЕДС.Услуги',
      },
      status: {
        type: 'string',
        description: 'Статус заявки в системе ЕДС.Услуги',
      },
    },
    required: ['user_id', 'item_id', 'description', 'status'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений об изменении статуса заявки в системе ЕДС.Услуги',
  tags: ['notifications'],
};

const notificationEdsServiceRequestDoneSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
        description: 'Идентификатор пользователя системы ЕДС.Услуги',
      },
      item_id: {
        type: 'number',
        description: 'Идентификатор заявки в системе ЕДС.Услуги',
      },
      description: {
        type: 'string',
        description: 'Описание заявки в системе ЕДС.Услуги',
      },
      route: {
        type: 'string',
        description: 'Тип заявки в системе ЕДС.Услуги',
      },
      sum: {
        type: 'number',
        description: 'Сумма заявки в системе ЕДС.Услуги',
      },
      category: {
        type: 'string',
        description: 'Категория заявки в системе ЕДС.Услуги',
      },
    },
    required: ['user_id', 'item_id', 'description'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Вебхук для отправки уведомлений о выполнении заявки в системе ЕДС.Услуги',
  tags: ['notifications'],
};

const countUnreadableUserNotificationSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения количества непрочитанных уведомлений пользователя',
  tags: ['notifications'],
};

const administrativeAppealsChangeStatusSchema = {
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      phone: {
        type: 'string',
        description: 'Номер телефона пользователя, которому отправляется уведомление',
      },
      status: {
        type: 'string',
        description: 'Статут обращения',
      },
      subject: {
        type: 'string',
        description: 'Тема обращения',
      },
    },
    required: ['phone', 'status', 'subject'],
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
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка' }],
    ),
  },
  description: 'Метод для отправки уведомления из админки при переводе обращения в статус Закрыто/Отклонено',
  tags: ['notifications'],
};

module.exports = {
  receiveFCMTokenSchema,
  listNotificationSchema,
  markReadNotificationSchema,
  addByManagingCompanyNotificationSchema,
  addNotificationByUserSchema,
  notificationEdsChangeRequestStatusSchema,
  notificationEdsRequestDoneSchema,
  notificationEdsPlanningShutdownSchema,
  notificationEdsEmergencyShutdownSchema,
  notificationEdsServiceChangeRequestSchema,
  notificationEdsServiceRequestDoneSchema,
  addByAddressOssNotificationSchema,
  addByAddressNotificationSchema,
  countUnreadableUserNotificationSchema,
  administrativeAppealsChangeStatusSchema,
};
