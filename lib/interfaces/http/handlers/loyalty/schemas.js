const { openapiResponseError, errorCodes } = require('shared/errors');

const createInvitation = {
  tags: ['loyalty'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Создать ссылку-приглашение',
  body: {
    type: 'object',
    properties: {
      type: {
        enum: [
          'POLL_SHARE_LINK',
          'OWNER_MEETINGS_SHARE_LINK',
          'REGISTRATION_SHARE_LINK',
        ],
      },
      sourceId: {
        anyOf: [
          {
            enum: ['REGISTRATION'],
          },
          {
            type: 'string',
            minLength: 1,
            description: 'ID объекта',
          },
        ],
      },
    },
    required: ['type', 'sourceId'],
  },
};

const cashoutInvitation = {
  tags: ['loyalty'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Воспользоваться приглашением (QR-кодом)',
  body: {
    type: 'object',
    properties: {
      hash: {
        type: 'string',
        minLength: 40,
        maxLength: 40,
      },
    },
    required: ['hash'],
  },
};

const createInvitationAdmin = {
  tags: ['loyalty-private'],
  security: [{ apiKey: [] }],
  descriptions: 'Создать ссылку-приглашение',
  body: {
    type: 'object',
    properties: {
      type: {
        enum: [
          'ACCESS_TO_SERVICE_WORKERS',
          'EVENT_PARTIPATION',
          'OWNER_MEETINGS_PARTIPATION',
          'CITIZENS_MEETINGS_PARTIPATION',
          'HOME_CARE_EVENT',
        ],
      },
      sourceId: {
        enum: ['QR'],
      },
      expirationDate: {
        type: 'string', format: 'date',
      },
    },
    required: ['type', 'sourceId', 'expirationDate'],
  },
};

const createOperationAdmin = {
  tags: ['loyalty-private'],
  security: [{ apiKey: [] }],
  descriptions: 'Создать операцию',
  body: {
    type: 'object',
    properties: {
      type: {
        enum: [
          'GK_LOCAL_EVENT',
          'GOOD_DEEDS_EVENT',
          'MANAGEMENT_COMPANY_REVIEW',
          'EMPLOYEE_EVENT',
          'ADMIN_DEBIT',
          'ADMIN_CREDIT',
        ],
      },
      amount: {
        type: 'number', format: 'int32',
      },
      userId: {
        type: 'number', format: 'int32',
      },
    },
    required: ['type', 'amount', 'userId'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Success',
    },
  },
};

const operationTypesAdmin = {
  tags: ['loyalty-private'],
  security: [{ apiKey: [] }],
  descriptions: 'Доступные типы программы лояльности',
};

const getInvitations = {
  tags: ['loyalty-private'],
  security: [{ apiKey: [] }],
  description: 'Метод получения сгенерированных QR-кодов',
  summary: 'Метод получения сгенерированных QR-кодов',
};

const getUsersActions = {
  tags: ['loyalty-private'],
  security: [{ apiKey: [] }],
  description: 'Метод получения данных по начислениям пользователей',
  summary: 'Метод получения данных по начислениям пользователей',
};

const createOperationExternal = {
  tags: ['loyalty-external'],
  security: [{ apiKey: [] }],
  descriptions: 'Создать операцию',
  body: {
    type: 'object',
    properties: {
      type: {
        enum: [
          'EDS_SERVICE_PAYMENT',
          'NEDOLZHNIK_PAID',
        ],
        description: 'EDS_SERVICE_PAYMENT - Кредит операция - Оплата услуги ЕДС / NEDOLZHNIK_PAID - Дебет операция - Оплата услуг ЖКХ',
      },
      id: {
        type: 'string',
        format: 'uuid',
        description: 'уникальный uuid операции, сгенерированный на стороне клиента API',
      },
      accountId: {
        type: 'string',
        description: 'id аккаунта ЕДС-Услуги / Лицевого счёта Недолжника',
        example: '8008',
      },
      date: {
        type: 'string',
        description: 'Дата операции дебет/кредит',
        format: 'date-time',
      },
      amount: {
        type: 'number',
        format: 'int32',
        description: 'Количество бонусов',
        nullable: false,
        example: 600,
        minimum: 1,
      },
      sourceId: {
        type: 'string',
        description: 'id источника операции (id операции оплаты, id заявки едс ...)',
        example: '162896',
      },
    },
    required: ['id', 'type', 'accountId', 'date', 'amount', 'sourceId'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Success',
    },
    ...openapiResponseError(
      errorCodes.BAD_TOKEN,
      errorCodes.BAD_REQUEST,
      [errorCodes.BAD_REQUEST, { additional: { description: 'Account ID not found!' } }],
      [errorCodes.BAD_REQUEST, { additional: { description: 'ID constraint' } }],
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.SERVER,
    ),
  },
};

const closeOperationExternal = {
  tags: ['loyalty-external'],
  security: [{ apiKey: [] }],
  descriptions: 'Отменить операцию',
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'уникальный uuid операции, сгенерированный на стороне клиента API',
      },
    },
  },
  response: {
    204: {
      type: 'null',
      description: 'Success',
    },
    ...openapiResponseError(
      errorCodes.BAD_TOKEN,
      errorCodes.BAD_REQUEST,
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.SERVER,
    ),
  },
};

const userPoints = {
  tags: ['loyalty'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Кол.во бонусов',
};

const userPointsDetailed = {
  tags: ['loyalty'],
  security: [{ bearerAuth: [] }],
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
  descriptions: 'Детальная информация по бонусам',
};

const pointsExternal = {
  tags: ['loyalty-external'],
  security: [{ apiKey: [] }],
  descriptions: 'Кол.во бонусов',
  query: {
    type: 'object',
    properties: {
      residentId: {
        type: 'string',
        minLength: 1,
      },
      edsProfileId: {
        type: 'string',
        minLength: 1,
      },
    },
  },
  response: {
    200: {
      points: {
        type: 'number',
        example: '2000',
        description: 'Кол.во бонусов',
      },
    },
  },
};

const pointsDetailedExternal = {
  tags: ['loyalty-external'],
  security: [{ apiKey: [] }],
  descriptions: 'Детальная информация по бонусам',
  query: {
    type: 'object',
    properties: {
      residentId: {
        type: 'string',
        minLength: 1,
      },
      edsProfileId: {
        type: 'string',
        minLength: 1,
      },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Своевременная оплата ЖКУ',
          },
          type: {
            enum: ['INCOME', 'OUTCOME'],
            example: 'INCOME',
            description: 'INCOME - дебет, OUTCOME - кредит',
          },
          amount: {
            type: 'number',
            format: 'int32',
            description: 'Количество бонусов',
            example: 400,
          },
          sourceId: {
            type: 'string',
            description: 'id источника операции (id операции оплаты, id заявки едс ...)',
            example: '9000',
          },
          createdAt: {
            type: 'string',
            description: 'Дата операции дебет/кредит',
            format: 'date-time',
          },
        },
      },
    },
  },
};

module.exports = {
  createInvitation,
  cashoutInvitation,

  createInvitationAdmin,
  createOperationAdmin,
  operationTypesAdmin,

  createOperationExternal,
  closeOperationExternal,

  userPoints,
  userPointsDetailed,

  pointsExternal,
  pointsDetailedExternal,

  getInvitations,
  getUsersActions,
};
