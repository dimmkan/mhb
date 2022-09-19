const Balance = {
  type: 'object',
  properties: {
    period: {
      title: 'Период',
      description: 'Период баланса – период, по которому сервис возвращает информацию о балансе абонента (формат дд.мм.гггг)',
      type: 'string',
      example: '01.01.2022',
    },
    start_debt: {
      title: 'Статус',
      description: 'Задолженность на начало периода',
      type: 'number',
      format: 'float',
      example: 0,
    },
    start_advance: {
      title: 'Статус',
      description: 'Переплата абонента на начало периода',
      type: 'number',
      format: 'float',
      example: 0,
    },
    charged: {
      title: 'Статус',
      description: 'Начислено за период',
      type: 'number',
      format: 'float',
      example: 0,
    },
    payed: {
      title: 'Статус',
      description: 'Оплачено',
      type: 'number',
      format: 'float',
      example: 0,
    },
    penalty: {
      title: 'Статус',
      description: 'Пени',
      type: 'number',
      format: 'float',
      example: 0,
    },
    balance: {
      title: 'Статус',
      description: 'Итоговая сумма баланса – к оплате',
      type: 'number',
      format: 'float',
      example: 0,
    },
    advance: {
      title: 'Статус',
      description: 'Итоговая сумма аванса',
      type: 'number',
      format: 'float',
      example: 0,
    },
    insurance: {
      title: 'Статус',
      description: 'Сумма к оплате за услугу «Добровольное страхование»',
      type: 'number',
      format: 'float',
      example: 0,
    },
    tovkgo: {
      title: 'Статус',
      description: 'Сумма к оплате за услугу «Техническое обслуживание ВКГО»',
      type: 'number',
      format: 'float',
      example: 0,
    },
    benefit: {
      title: 'Статус',
      description: 'Льготы',
      type: 'number',
      format: 'float',
      example: 0,
    },
    recalc: {
      title: 'Статус',
      description: 'Перерасчеты',
      type: 'number',
      format: 'float',
      example: 0,
    },
  },
};

const Charge = {
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date',
      example: '2023-09-01',
      description: 'Дата начисления',
    },
    pay: {
      title: 'К оплате',
      description: 'Сумма итого к оплате',
      properties: {
        non_insurance: {
          title: 'Итого к оплате без учета добровольного страхования',
          description: 'Итого к оплате без учета добровольного страхования',
          type: 'number',
          format: 'float',
          example: 0,
        },
        insurance: {
          title: 'Сумма к оплате за услугу «Добровольное страхование»',
          description: 'Сумма к оплате за услугу Добровольное страхование',
          type: 'number',
          format: 'float',
          example: 0,
        },
        with_insurance: {
          title: 'Итого сумма к оплате',
          description: 'Итого сумма к оплате',
          type: 'number',
          format: 'float',
          example: 0,
        },
      },
      type: 'object',
    },
    payed: {
      title: 'Оплачено',
      description: 'Оплачено',
      type: 'number',
      format: 'float',
      example: 0,
    },
    payed_before: {
      title: 'Задолженность/переплата (-) на начало периода',
      description: 'Задолженность/переплата (-) на начало периода',
      type: 'number',
      format: 'float',
      example: 0,
    },
    recalculations: {
      title: 'Сумма перерасчета',
      description: 'Сумма перерасчета',
      type: 'number',
      format: 'float',
      example: 0,
    },
    charged: {
      title: 'Сумма начислено за период',
      description: 'Сумма начислено за период',
      type: 'number',
      format: 'float',
      example: 0,
    },
    benefits: {
      title: 'Льготы',
      description: 'Льготы',
      type: 'number',
      format: 'float',
      example: 0,
    },
    penalty: {
      title: 'Пени',
      description: 'Пени',
      type: 'number',
      format: 'float',
      example: 0,
    },
  },
};

const Meashure = {
  type: 'object',
  properties: {
    id: {
      title: 'id',
      description: 'id',
      type: 'number',
      format: 'integer',
      example: 0,
    },
    name: {
      title: 'name',
      description: 'name',
      type: 'string',
      example: '',
    },
    last_indication: {
      title: 'Последнее показание',
      description: 'Последнее показание',
      properties: {
        epd: {
          title: 'Показание, учтенное в последнем ЕПД',
          description: 'Показание, учтенное в последнем ЕПД',
          type: 'number',
          format: 'float',
          example: 0,
        },
        abonent: {
          title: 'Последнее переданное абонентом показание',
          description: 'Последнее переданное абонентом показание',
          type: 'number',
          format: 'float',
          example: 0,
        },
        date: {
          type: 'string',
          format: 'date',
          example: '2023-09-01',
          description: 'Дата начисления',
        },
      },
      type: 'object',
    },
    measure_unit: {
      title: 'Единица измерения по услуге',
      description: 'Единица измерения по услуге',
      type: 'string',
      example: '',
    },
    zone: {
      title: 'Тарифная зона',
      description: 'Тарифная зона',
      type: 'number',
      format: 'integer',
      example: 0,
    },
    service: {
      title: 'Услуга',
      description: 'Услуга',
      properties: {
        id: {
          title: 'Идентификатор',
          description: 'Идентификатор услуги',
          type: 'number',
          format: 'int64',
          example: 0,
        },
        name: {
          title: 'Наименование',
          description: 'Наименование услуги',
          type: 'string',
          example: '',
        },
        provider: {
          title: 'Поставщик',
          description: 'Наименование поставщика услуги',
          type: 'string',
          example: '',
        },
      },
      type: 'object',
    },
    receive_period: {
      title: 'Период передачи показаний',
      description: 'Период передачи показаний',
      properties: {
        first_day: {
          title: 'Начало периода',
          description: 'Число месяца начала приема показаний по поставщику',
          type: 'number',
          format: 'int64',
          example: '01',
        },
        last_day: {
          title: 'Конец периода',
          description: 'Число месяца окончания приема показаний по поставщику',
          type: 'number',
          format: 'int64',
          example: '31',
        },
      },
      type: 'object',
    },
    verification_period: {
      title: 'Срок межповерочного интервала (МПИ)',
      description: 'Срок межповерочного интервала (МПИ)',
      type: 'string',
      format: 'date',
      example: '2023-09-01',
    },
    no_access_reason: {
      title: 'Причина невозможности оказания услуги',
      description: 'Причина невозможности оказания услуги',
      type: 'string',
      example: '',
    },
  },
};

const Indication = {

  type: 'object',
  properties: {
    id: {
      title: 'Идентификатор счетчика',
      description: 'Идентификатор счетчика',
      type: 'number',
      format: 'int64',
      example: 0,
    },
    name: {
      title: 'Наименование счетчика',
      description: 'Наименование счетчика',
      type: 'string',
      example: '',
    },
    last_indication: {
      title: 'Последнее показание',
      description: 'Последнее показание',
      properties: {
        epd: {
          title: 'Показание, учтенное в последнем ЕПД',
          description: 'Показание, учтенное в последнем ЕПД',
          type: 'number',
          format: 'float',
          example: 0,
        },
        abonent: {
          title: 'Последнее переданное абонентом показание',
          description: 'Последнее переданное абонентом показание',
          type: 'number',
          format: 'float',
          example: 0,
        },
        date: {
          title: 'Дата последнего переданного абонентом показания',
          description: 'Дата последнего переданного абонентом показания',
          type: 'string',
          example: '2022-01-01',
        },
      },
      type: 'object',
    },
    measure_unit: {
      title: 'Единица измерения по услуге',
      description: 'Единица измерения по услуге',
      type: 'string',
      example: '',
    },
    zone: {
      title: 'Тарифная зона',
      description: 'Тарифная зона',
      type: 'number',
      format: 'int64',
      example: 0,
    },
    service: {
      title: 'Услуга',
      description: 'Услуга',
      properties: {
        id: {
          title: 'Идентификатор',
          description: 'Идентификатор услуги',
          type: 'number',
          format: 'int64',
          example: 0,
        },
        name: {
          title: 'Наименование',
          description: 'Наименование услуги',
          type: 'string',
          example: '',
        },
        provider: {
          title: 'Поставщик',
          description: 'Наименование поставщика услуги',
          type: 'string',
          example: '',
        },
      },
      type: 'object',
    },
    receive_period: {
      title: 'Период передачи показаний',
      description: 'Период передачи показаний',
      properties: {
        first_day: {
          title: 'Начало периода',
          description: 'Число месяца начала приема показаний по поставщику',
          type: 'number',
          format: 'int64',
          example: '01',
        },
        last_day: {
          title: 'Конец периода',
          description: 'Число месяца окончания приема показаний по поставщику',
          type: 'number',
          format: 'int64',
          example: '31',
        },
      },
      type: 'object',
    },
    verification_period: {
      title: 'Срок межповерочного интервала (МПИ)',
      description: 'Срок межповерочного интервала (МПИ)',
      type: 'string',
      example: '2023-09-01',
    },
    no_access_reason: {
      title: 'Причина невозможности оказания услуги',
      description: 'Причина невозможности оказания услуги',
      type: 'string',
      example: '',
    },
    img: {
      title: 'Иконка',
      description: 'Иконка',
      type: 'string',
      example: '',
    },
    result: {
      title: 'Результат приема показаний',
      description: 'Результат приема показаний',
      type: 'string',
      example: '',
    },
    error: {
      title: 'Ошибка при приеме показаний',
      description: 'Ошибка при приеме показаний',
      type: 'string',
      example: '',
    },
  },

};

const Payment = {
  type: 'object',
  properties: {
    date: {
      title: 'Дата',
      description: 'Дата совершения перевода',
      type: 'string',
      example: '2021-09-01',
    },
    payed: {
      title: 'Сумма',
      description: 'Сумма перевода',
      type: 'number',
      format: 'float',
      example: 0,
    },
    agent: {
      title: 'Источник платежа',
      description: 'Организация принявшая перевод',
      type: 'string',
      example: 'Платежный агент',
    },
    status: {
      title: 'Статус',
      description: 'Статус перевода',
      type: 'string',
      example: 'Принят',
    },
  },
};

const getResidentProfiles = {
  description: 'Метод для получения списка Л/С',
  summary: 'Метод для получения списка Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
};

const getResidentProfile = {
  description: 'Метод для получения данных конкретного Л/С',
  summary: 'Метод для данных конкретного Л/С',
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
};

const createResidentProfile = {
  description: 'Метод для добавления Л/С',
  summary: 'Метод для добавления Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      residentId: { type: 'string' },
      paidByReceipt: { type: 'number' },
    },
    required: ['residentId', 'paidByReceipt'],
  },
  // response: {
  //   200: {
  //     type: 'object',
  //     properties: {
  //       parentId: { type: 'number' },
  //       confirmed: { type: 'boolean' },
  //       userId: { type: 'number' },
  //       residentId: { type: 'string' },
  //       id: { type: 'number' },
  //     },
  //   },
  //   // 400: {
  //   //   // errorCodes.VALIDATION
  //   //   type: 'object',
  //   //   description: 'Некорректный запрос',
  //   // },
  //   // 401: {
  //   //   // errorCodes.BAD_TOKEN
  //   //   type: 'object',
  //   //   description: 'Ошибка авторизации - некорректный токен',
  //   // },
  //   // 500: {
  //   //   // errorCodes.INTERNAL_SERVER_ERROR
  //   //   type: 'object',
  //   //   description: 'Внутренняя ошибка сервиса',
  //   // },
  // },
};

const deleteResidentProfile = {
  description: 'Метод для удаления Л/С',
  summary: 'Метод для удаления Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Успешное выполнение запроса',
    },
    // 400: {
    //   // errorCodes.VALIDATION
    //   type: 'object',
    //   description: 'Некорректный запрос',
    // },
    // 401: {
    //   // errorCodes.BAD_TOKEN
    //   type: 'object',
    //   description: 'Ошибка авторизации - некорректный токен',
    // },
    // 500: {
    //   // errorCodes.INTERNAL_SERVER_ERROR
    //   type: 'object',
    //   description: 'Внутренняя ошибка сервиса',
    // },
  },
};

const forceDeleteResidentProfile = {
  description: 'Метод для принудительного удаления Л/С и всех привязанных пользователей',
  summary: 'Метод для принудительного удаления Л/С и всех привязанных пользователей',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Успешное выполнение запроса',
    },
  },
};

const getUsers = {
  tags: ['residentProfiles'],
  description: 'Получить список привязанных к Л/С пользователей',
  summary: 'Получить список привязанных к Л/С пользователей',
  security: [{ bearerAuth: [] }],
};

const acceptUser = {
  description: 'Метод для подтверждения привязки пользователя к Л/С',
  summary: 'Метод для подтверждения привязки пользователя к Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Успешное выполнение запроса',
    },
    // 400: {
    //   // errorCodes.VALIDATION
    //   type: 'object',
    //   description: 'Некорректный запрос',
    // },
    // 401: {
    //   // errorCodes.BAD_TOKEN
    //   type: 'object',
    //   description: 'Ошибка авторизации - некорректный токен',
    // },
    // 500: {
    //   // errorCodes.INTERNAL_SERVER_ERROR
    //   type: 'object',
    //   description: 'Внутренняя ошибка сервиса',
    // },
  },
};

const declineUser = {
  description: 'Метод для отклонения привязки пользователя к Л/С',
  summary: 'Метод для отклонения привязки пользователя к Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Успешное выполнение запроса',
    },
    // 400: {
    //   // errorCodes.VALIDATION
    //   type: 'object',
    //   description: 'Некорректный запрос',
    // },
    // 401: {
    //   // errorCodes.BAD_TOKEN
    //   type: 'object',
    //   description: 'Ошибка авторизации - некорректный токен',
    // },
    // 500: {
    //   // errorCodes.INTERNAL_SERVER_ERROR
    //   type: 'object',
    //   description: 'Внутренняя ошибка сервиса',
    // },
  },
};

const deleteUser = {
  description: 'Метод для удаления пользователей Л/С',
  summary: 'Метод для удаления пользователей Л/С',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    204: {
      type: 'null',
      description: 'Успешное выполнение запроса',
    },
    // 400: {
    //   // errorCodes.VALIDATION
    //   type: 'object',
    //   description: 'Некорректный запрос',
    // },
    // 401: {
    //   // errorCodes.BAD_TOKEN
    //   type: 'object',
    //   description: 'Ошибка авторизации - некорректный токен',
    // },
    // 500: {
    //   // errorCodes.INTERNAL_SERVER_ERROR
    //   type: 'object',
    //   description: 'Внутренняя ошибка сервиса',
    // },
  },
};

const getMeashures = {
  summary: 'Получить приборы учета лицевого счета',
  description: 'Возвращает приборы учета счета по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'array',
      items: Meashure,
    },
  },
};

const getIndications = {
  summary: 'Получить показания лицевого счета',
  description: 'Возвращает показания лицевого счета по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      title: 'Показания счетчиков',
      type: 'array',
      items: {
        type: 'array',
        items: Indication,
      },
    },
  },
};

const createIndication = {
  deprecated: true,
  summary: 'Внести показания',
  description: 'Возвращает данные внесенного показания',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      id: {
        title: 'Идентификатор счетчика',
        description: 'Идентификатор счетчика',
        type: 'number',
        example: 0,
      },
      zone: {
        title: 'Тарифная зона',
        description: 'Тарифная зона',
        type: 'number',
        example: 0,
      },
      value: {
        title: 'Показание',
        description: 'Показание',
        type: 'number',
        example: 0,
      },
    },
    required: ['id', 'zone', 'value'],
  },
};

const createIndicationTemporary = {
  summary: 'Внести показания',
  description: 'Возвращает данные внесенного показания',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      id: {
        title: 'Идентификатор счетчика',
        description: 'Идентификатор счетчика',
        type: 'number',
        example: 0,
      },
      zone: {
        title: 'Тарифная зона',
        description: 'Тарифная зона',
        type: 'number',
        example: 0,
      },
      value: {
        title: 'Показание',
        description: 'Показание',
        type: 'number',
        minimum: 0.00001,
        example: 0,
      },
      imageId: {
        title: 'ID Загруженного изображения',
        description: 'ID Загруженного изображения',
        type: 'string',
        format: 'uuid',
      },
    },
    required: ['id', 'zone', 'value'],
  },
};

const getPaymentLink = {
  summary: 'Получить ссылку на оплату',
  description: 'Получить ссылку на оплату',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      amount: {
        type: 'number',
        minimum: 1,
        example: '975.01',
        description: 'Сумма оплаты',
      },
      type: {
        enum: ['insurance'],
        example: 'insurance',
        description: 'insurance - оплата "со страховкой"',
      },
    },
    required: ['amount'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
      },
    },
  },
};

const getPayments = {
  summary: 'Получить список платежей',
  description: 'Возвращает список платежей по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'array',
      items: Payment,
    },
  },
};

const getReceipt = {
  summary: 'Получить квитанцию для лицевого счета',
  description: 'Возвращает  квитанцию для лицевого счета по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        format: 'date',
        example: '2023-09-01',
      },
    },
  },
};

const getCharges = {
  summary: 'Получить начисления лицевого счета',
  description: 'Возвращает начисления лицевого счета по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'array',
      items: Charge,
    },
  },
};

const getBalance = {
  summary: 'Получить расшифровку баланса',
  description: 'Возвращает расшифровку баланса по номеру',
  tags: ['residentProfiles'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: { 200: Balance },
};

const uploadIndicationImage = {
  tags: ['residentProfiles'],
  summary: 'Загрузка изображений для показания',
  description: 'Загрузка изображений для показания',
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      file: {
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
      },
    },
    required: ['file'],
  },
};

module.exports = {
  getResidentProfiles,
  createResidentProfile,
  deleteResidentProfile,
  forceDeleteResidentProfile,

  getUsers,
  acceptUser,
  declineUser,
  deleteUser,

  getMeashures,
  getIndications,
  createIndication,
  getPaymentLink,
  getReceipt,
  getCharges,
  getPayments,
  getBalance,
  createIndicationTemporary,
  uploadIndicationImage,
  getResidentProfile,
};
