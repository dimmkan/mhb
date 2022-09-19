const { errorCodes, openapiResponseError } = require('shared/errors');

const imageFile = {
  type: 'object',
  properties: {
    mimetype: {
      enum: [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ],
    },
  },
};

const requestBody = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID заявки' },
    '1cidnum': { type: 'string', description: 'Номер заявки 1С' },
    wanttobonus: {
      type: 'number',
      description: '1 - Желаю оплатить бонусами, 0 - нет',
    },
    can_pay_bonus: {
      type: 'number',
      description: '1 - Можно оплатить бонусами, 0 - нет',
    },
    name: { type: 'string', description: 'Заголовок заявки' },
    category: { type: 'string', description: 'Родительская категория' },
    parent_category: { type: 'string', description: 'Категория' },
    description: { type: 'string', description: 'Описание заявки' },
    date: { type: 'string', format: 'date', description: 'Дата и время создания' },
    date_to: { type: 'string', format: 'date', description: 'Выполнить' },
    status: {
      type: 'string', description: ` 
    Новая, 
    Запланирована, 
    В работе,
    Подтвердить акт (опц статус только при оплате онлайн),
    Выполнена, 
    Отклонена`,
    },
    mastername: { type: 'string', description: 'ФИО мастера' },
    masterimage: { type: 'string', description: 'Аватар мастера' },
    masterphone: { type: 'string', description: 'Телефон мастера' },
    client_name: { type: 'string', description: 'ФИО клиента' },
    client_avatar: { type: 'string', description: 'Аватар клиента' },
    client_phone: { type: 'string', description: 'Телефон клиента' },
    act_id: { type: 'string', description: 'Акт пользователя для оплаты' },
    act_sum: { type: 'string', description: 'Сумма акта' },
    payed: { type: 'string', description: 'Оплачено или нет' },
    date_act: { type: 'string', format: 'date', description: 'Дата и время оплаты (акта)' },
    client_review: { type: 'string', description: 'Оценка от клиента' },
    payable: { type: 'number', description: 'Оплата онлайн доступна (1 - да)' },
    master_review: { type: 'string', description: 'Оценка мастером' },
    city: { type: 'string', description: 'Город' },
    naspunkt: { type: 'string' },
    street: { type: 'string', description: 'Улица' },
    korp: { type: 'string', description: 'Корпус' },
    stroen: { type: 'string', description: 'Строение' },
    house: { type: 'string', description: 'Дом' },
    podezd: { type: 'string', description: 'Подъезд' },
    etazh: { type: 'string', description: 'Этаж' },
    kvart: { type: 'string', description: 'Квартира' },
    domofon: { type: 'string', description: 'Домофон' },
    address: { type: 'string', description: 'Адрес' },
    foto1: { type: 'string' },
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
};

const createRequest = {
  tags: ['edsServices'],
  description: 'Создание заявки в системе ЕДС-Услуги',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: { type: 'number' },
        description: 'Массив имен файлов, полученных методом POST */request/images',
      },
      wanttobonus: {
        enum: [
          0, 1,
        ],
        description: '1 - Желаю оплатить бонусами, 0 - нет',
      },
      category_id: {
        type: 'number',
        description: 'ID категории заявки',
      },
      description: {
        type: 'string',
        description: 'Описание заявки',
      },
      date_from: {
        type: 'string',
        description: 'Дата прихода мастера (d.m.Y)  (если пусто,то ставится сегодня)',
      },
      date_to: {
        type: 'string',
        description: 'Час прихода (hh:mm)',
      },
      address: {
        type: 'object',
        properties: {
          value: {
            type: 'string',
            description: 'Адрес целиком',
          },
          city: {
            type: 'string',
            description: 'Город',
          },
          street: {
            type: 'string',
            description: 'Наименование улицы',
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
        required: [
          'city',
          'street',
          'house',
        ],
      },
    },
    required: [
      'category_id',
      'description',
      'date_to',
      'address',
    ],
  },
  response: {
    200: requestBody,
  },
};

const request = {
  tags: ['edsServices'],
  description: 'Заявка',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
    },
    required: ['id'],
  },
  response: {
    200: requestBody,
  },
};

const requests = {
  tags: ['edsServices'],
  description: 'Получение списка заявок пользователя',
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
    required: ['page', 'limit'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        pages: {
          type: 'object',
          properties: {
            all: { type: 'number' },
            pages: { type: 'number' },
            onpage: { type: 'number' },
          },
          description: 'Содержание пагинации',
        },
        data: { type: 'array', items: requestBody },
      },
    },
  },
};

const requestsPaymentUrl = {
  tags: ['edsServices'],
  description: 'Получение ссылки на оплату заявки',
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      bonuses: { type: 'number', minimum: 10, description: 'Бонусы' },
      tips: { type: 'number', minimum: 1, description: 'Чаевые в рублях' },
      tipsFromBonuses: { type: 'boolean', description: 'Пересчитать чаевые рубли в бонусы' },
    },
  },
  response: {
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      errorCodes.EXTERNAL,
      errorCodes.EDS_REQ_NOT_PAYABLE,
      errorCodes.EDS_REQ_POINTS_LIMIT,
    ),
  },
};

const requestsCategoriesWithPrice = {
  tags: ['edsServices'],
  description: 'Категории заявок (прайс-лист)',
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          id: { type: 'number' },
          parentid: { type: 'number' },
          price: { type: 'number' },
          isgroup: { type: 'number' },
          can_pay_bonus: {
            type: 'number',
            description: '1 - Можно оплатить бонусами, 0 - нет',
          },
        },
      },
    },
  },
};

const notificationsDisable = {
  tags: ['edsServices'],
  description: 'Отключение уведомлений для приложения ЕДС-Услуг',
  security: [{ bearerAuth: [] }],
};

const bonuses = {
  tags: ['edsServices'],
  description: 'Бонусы пользователя ЕДС-Услуг',
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      orders: { type: 'number' },
      sum: { type: 'number' },
      discount: { type: 'number' },
      tarif: { type: 'string' },
      last_order: { type: 'string', format: 'date' },
    },
    404: {
      // errorCodes.NOT_FOUND,
      type: 'object',
      description: 'Бонусы не найдены',
    },
  },
};

const uploadImages = {
  tags: ['edsServices'],
  description: 'Загрузка изображений для заявки',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      files: {
        oneOf: [
          {
            type: 'array',
            items: imageFile,
          },
          imageFile,
        ],
      },
    },
    required: ['files'],
  },
};

const addProfile = {
  security: [{ apiKey: [] }],
  description: 'Связка учетной записи Наш Дом и ЕДС.Услуги',
  tags: ['edsServices'],
  body: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'ID пользователя в системе Наш Дом',
      },
      profileId: {
        type: 'string',
        description: 'ID пользователя в системе ЕДС.Услуги',
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
  createRequest,
  request,
  requests,
  requestsPaymentUrl,
  requestsCategoriesWithPrice,
  notificationsDisable,
  bonuses,
  uploadImages,
  addProfile,
};
