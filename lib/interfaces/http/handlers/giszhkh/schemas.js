const { errorCodes, openapiResponseError } = require('shared/errors');

const getGenegalInformationSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID лицевого счета',
      },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        houseProfileData: {
          type: 'object',
          properties: {
            management_contract_date_start: {
              type: 'string',
              description: 'Дата договора управления МКД',
            },
            cadastral_number: {
              type: 'string',
              description: 'Кадастровый номер',
            },
            method_of_forming_overhaul_fund: {
              type: 'string',
              description: 'Способ формирования фонда капитального ремонта',
            },
            built_year: {
              type: 'number',
              description: 'Год постройки',
            },
            exploitation_start_year: {
              type: 'number',
              description: 'Год ввода в эксплуатацию',
            },
            project_type: {
              type: 'string',
              description: 'Серия, тип постройки здания',
            },
            floor_count_max: {
              type: 'number',
              description: 'Количество этажей, наибольшее, ед.',
            },
            floor_count_min: {
              type: 'number',
              description: 'Количество этажей, наименьшее, ед.',
            },
            entrance_count: {
              type: 'number',
              description: 'Количество подъездов, ед.',
            },
            elevators_count: {
              type: 'number',
              description: 'Количество лифтов, ед.',
            },
            area_land: {
              type: 'string',
              description: 'Площадь земельного участка, входящего в состав общего имущества в многоквартирном доме, кв.м',
            },
            flats_count: {
              type: 'number',
              description: 'Количество помещений, ед.',
            },
            living_quarters_count: {
              type: 'number',
              description: 'Количество помещений, в том числе, жилых, ед.',
            },
            not_living_quarters_count: {
              type: 'number',
              description: 'Количество помещений, в том числе, нежилых, ед.',
            },
            area_total: {
              type: 'string',
              description: 'Общая площадь дома, кв.м',
            },
            area_residential: {
              type: 'string',
              description: 'Общая площадь дома, в т.ч. жилых помещений, кв.м',
            },
            area_non_residential: {
              type: 'string',
              description: 'Общая площадь дома, в т.ч. нежилых помещений, кв.м',
            },
            area_common_property: {
              type: 'string',
              description: 'Общая площадь дома, в т.ч. помещений, входящих в состав общего имущества, кв.м.',
            },
            energy_efficiency: {
              type: 'string',
              description: 'Класс энергетической эффективности',
            },
            is_alarm: {
              type: 'boolean',
              description: 'Признак аварийности',
            },
            alarm_document: {
              type: 'string',
              description: 'Документ признания дома аварийным',
            },
            alarm_reason: {
              type: 'string',
              description: 'Причина признания дома аварийным',
            },
          },
        },
        fileInfo: {
          type: 'object',
          properties: {
            file_id: {
              type: 'number',
              description: 'Идентификатор файла',
            },
            name: {
              type: 'string',
              description: 'Имя файла',
            },
            extension: {
              type: 'string',
              description: 'Расширение файла',
            },
            size: {
              type: 'number',
              description: 'Размер файла',
            },
            create_date: {
              type: 'string',
              description: 'Дата создания файла',
            },
          },
        },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.NOT_FOUND, { description: 'Данные для авторизации не найдены', additional: { message: 'string' } }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.BAD_REQUEST, { description: 'Ошибка получения данных', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения общей информации по дому',
  tags: ['giszhkh'],
};

const downloadInvoiceSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID лицевого счета',
      },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'Идентификатор файла',
      },
    },
    required: ['fileId'],
  },
  response: {
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.NOT_FOUND, { description: 'Данные для авторизации не найдены', additional: { message: 'string' } }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.BAD_REQUEST, { description: 'Ошибка получения данных', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для скачивания договора управления МКД по ID файла',
  tags: ['giszhkh'],
};

const getPeriodListSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID лицевого счета',
      },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'array',
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.NOT_FOUND, { description: 'Данные для авторизации не найдены', additional: { message: 'string' } }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.BAD_REQUEST, { description: 'Ошибка получения данных', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения списка периодов формирования отчета по управлению',
  tags: ['giszhkh'],
};

const getManagingReportSchema = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID лицевого счета',
      },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      periodId: {
        type: 'string',
        description: 'Идентификатор периода отчета',
      },
    },
    required: ['periodId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        cash_balance_beginning_period: {
          type: 'string',
          description: 'Переходящие остатки денежных средств (на начало периода), руб.',
        },
        cash_balance_beginning_period_consumers_overpayment: {
          type: 'string',
          description: 'Авансовые платежи потребителей (на начало периода), руб.',
        },
        cash_balance_beginning_period_consumers_arrears: {
          type: 'string',
          description: 'Задолженность потребителей (на начало периода), руб.',
        },
        charged_for_services: {
          type: 'string',
          description: 'Начислено за услуги (работы) по содержанию и текущему ремонту, руб. (всего)',
        },
        charged_for_maintenance_of_house: {
          type: 'string',
          description: 'Начислено за услуги (работы) по содержанию и текущему ремонту, в том числе, за содержание дома, руб.',
        },
        charged_for_maintenance_work: {
          type: 'string',
          description: 'Начислено за услуги (работы) по содержанию и текущему ремонту, в том числе, за текущий ремонт, руб.',
        },
        charged_for_management_service: {
          type: 'string',
          description: 'Начислено за услуги (работы) по содержанию и текущему ремонту, в том числе, за услуги управления, руб.',
        },
        received_cash: {
          type: 'string',
          description: 'Получено денежных средств, руб. (всего)',
        },
        received_cash_from_owners: {
          type: 'string',
          description: 'Получено денежных средств, в т.ч., денежных средств от собственников/нанимателей помещений, руб.',
        },
        received_target_payment_from_owners: {
          type: 'string',
          description: 'Получено денежных средств, в т.ч., целевых взносов от собственников/нанимателей помещений, руб.',
        },
        received_subsidies: {
          type: 'string',
          description: 'Получено денежных средств, в т.ч., субсидий, руб.',
        },
        received_from_use_of_common_property: {
          type: 'string',
          description: 'Получено денежных средств, в т.ч., денежных средств от использования общего имущества, руб.',
        },
        received_from_other: {
          type: 'string',
          description: 'Получено денежных средств, в т.ч., прочие поступления, руб.',
        },
        cash_total: {
          type: 'string',
          description: 'Всего денежных средств с учетом остатков, руб.',
        },
        cash_balance_ending_period: {
          type: 'string',
          description: 'Переходящие остатки денежных средств на конец периода, руб.',
        },
        cash_balance_ending_period_consumers_overpayment: {
          type: 'string',
          description: 'Авансовые платежи потребителей на конец периода, руб.',
        },
        cash_balance_ending_period_consumers_arrears: {
          type: 'string',
          description: 'Задолженность потребителей на конец периода, руб.',
        },
      },
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      errorCodes.BAD_TOKEN,
      [errorCodes.NOT_FOUND, { description: 'Данные для авторизации не найдены', additional: { message: 'string' } }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
      [errorCodes.BAD_REQUEST, { description: 'Ошибка получения данных', additional: { message: 'string' } }],
    ),
  },
  description: 'Метод для получения отчета по управлению за период',
  tags: ['giszhkh'],
};

const flushCacheSchema = {
  description: 'Метод для сброса кэша данных',
  tags: ['giszhkh'],
};

module.exports = {
  getGenegalInformationSchema,
  downloadInvoiceSchema,
  getPeriodListSchema,
  getManagingReportSchema,
  flushCacheSchema,
};
