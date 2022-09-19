const residentId = {
  type: 'string',
  description: 'Лицевой счет',
};
const manager = { type: 'string', description: 'Должностное лицо (руководитель УК)' };
const themeId = { type: 'string', description: 'id темы' };
const theme = { type: 'string', description: 'Название темы' };
const date = { type: 'string', description: 'Дата приема' };
const time = { type: 'string', description: 'Время приема' };
const content = { type: 'string', description: 'Текст заявки' };
const id = { type: 'string', description: 'Уникальный id бизнесс-процесса в УПП ОРН' };
const idUser = { type: 'string', description: 'id пользователя в системе "Мой дом"' };
const status = {
  type: 'number',
  description: 'Статус процесса (0 - в работе, 1 - завершен без оценки, 2 - с оценкой)',
};
const success = {
  type: 'boolean',
  description: 'Результат операции',
};

const getFormData = {
  tags: ['appointments'],
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
  response: {
    200: {
      type: 'object',
      properties: {
        manager,
        themes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: themeId,
              group: { type: 'boolean', description: 'Флаг "Группа" (для группировки тем)' },
              parentId: { type: 'string', description: 'Ссылка на родителя (группу)' },
              name: theme,
            },
          },
        },
        schedule: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date,
              time,
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
  description: 'Получение данных для формы записи',
};

const getAppointments = {
  tags: ['appointments'],
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
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id,
          idUser,
          theme,
          appointmentDate: date,
          appointmentTime: time,
          manager,
          status,
          content,
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
  description: 'Получение списка записей',
};

const createAppointment = {
  tags: ['appointments'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      residentId,
      themeId,
      date,
      time,
      content,
    },
    required: ['residentId', 'themeId', 'date', 'time', 'content'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id,
        idUser,
        theme,
        appointmentDate: date,
        appointmentTime: time,
        manager,
        status,
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
      // errorCodes.IS_BUSY
      // errorCodes.NO_APPOINTMENTS_ON_THIS_DATE
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Запись на прием',
};

const cancelAppointment = {
  tags: ['appointments'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      residentId,
      id,
    },
    required: ['residentId', 'id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success,
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
  description: 'Отмена записи',
};

const putGrade = {
  tags: ['appointments'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      residentId,
      id,
      grade: { type: 'number', description: 'Оценка приема от 1 до 5' },
      message: { type: 'string', description: 'Комментарий' },
    },
    required: ['residentId', 'id', 'grade'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success,
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
  description: 'Оценка качества приема',
};

const putGradeWebhook = {
  tags: ['appointments'],
  security: [
    {
      apiKey: [],
    },
  ],
  body: {
    type: 'object',
    properties: {
      id,
      idUser,
      personalAccount: residentId,
      type: {
        type: 'string',
        description: 'Идентификатор "0 - Личный прием / 1 - Обращение"',
      },
      theme,
      status: {
        type: 'string',
        description: 'Статус процесса (0 - в работе, 1 - завершен без оценки, 2 - с оценкой)',
      },
      date,
      time,
    },
    required: ['id', 'idUser', 'personalAccount', 'type', 'theme', 'status', 'date', 'time'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success,
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
  description: 'Вебхук об оценке приема',
};

module.exports = {
  getFormData,
  getAppointments,
  createAppointment,
  cancelAppointment,
  putGrade,
  putGradeWebhook,
};
