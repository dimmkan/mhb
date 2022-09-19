const ATTACHMENT_MIME_TYPES = require('shared/entities/appealsAttachmentMimeTypes');

const residentId = {
  type: 'string',
  description: 'Лицевой счет',
};
const themeId = { type: 'string', description: 'id темы' };
const theme = { type: 'string', description: 'Название темы' };
const content = { type: 'string', description: 'Текст обращения' };
const answerInPaperForm = { type: 'boolean', description: 'Получение ответа в бумажной форме' };
const id = { type: 'string', description: 'Уникальный id бизнесс-процесса в УПП ОРН' };
const idUser = { type: 'string', description: 'id пользователя в системе "Мой дом"' };
const date = { type: 'string', description: 'Дата обращения' };
const dateOfReply = { type: 'string', description: 'Дата ответа' };
const status = {
  type: 'number',
  description: 'Статус процесса (0 - в работе, 1 - завершен без оценки, 2 - с оценкой)',
};
const success = {
  type: 'boolean',
  description: 'Результат операции',
};
const files = {
  type: ['object', 'array'],
  items: {
    type: 'object',
    properties: {
      mimetype: {
        enum: ATTACHMENT_MIME_TYPES,
      },
    },
  },
  properties: {
    mimetype: {
      enum: ATTACHMENT_MIME_TYPES,
    },
  },
  description: 'Файлы обращения',
};

const getFormData = {
  tags: ['appeals'],
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
          id: themeId,
          group: { type: 'boolean', description: 'Флаг "Группа" (для группировки тем)' },
          parentId: { type: 'string', description: 'Ссылка на родителя (группу)' },
          name: theme,
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
      // errorCodes.SERVER
      // errorCodes.EXTERNAL
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Получение данных для формы обращения',
};

const getAppeals = {
  tags: ['appeals'],
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
          date,
          theme,
          content,
          status,
          dateOfReply,
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Имя файла' },
                link: { type: 'string', description: 'Ссылка на файл' },
              },
            },
            description: 'Список файлов',
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
      // errorCodes.SERVER
      // errorCodes.EXTERNAL
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Получение списка обращений',
};

const createAppeal = {
  tags: ['appeals'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    properties: {
      residentId: { properties: { value: residentId } },
      themeId: { properties: { value: themeId } },
      answerInPaperForm: { properties: { value: answerInPaperForm } },
      content: { properties: { value: content } },
      files,
    },
    required: ['residentId', 'themeId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id,
        idUser,
        date,
        themeId,
        content,
        status,
        dateOfReply,
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Имя файла' },
              link: { type: 'string', description: 'Ссылка на файл' },
            },
          },
          description: 'Список файлов',
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
      // errorCodes.SERVER
      // errorCodes.EXTERNAL
      type: 'object',
      properties: {
        status: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
      },
      description: 'Внутренняя ошибка сервиса',
    },
  },
  description: 'Создание обращения',
};

const putGrade = {
  tags: ['appeals'],
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

module.exports = {
  getFormData,
  getAppeals,
  createAppeal,
  putGrade,
};
