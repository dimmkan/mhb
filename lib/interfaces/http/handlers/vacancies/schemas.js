const { errorCodes, openapiResponseError } = require('shared/errors');
const ATTACHMENT_MIME_TYPES = require('shared/entities/vacanciesAttachmentMimeTypes');

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
  description: 'Прикрепленные файлы',
};

const vacancyResponse = {
  tags: ['vacancies'],
  consumes: ['multipart/form-data'],
  params: {
    type: 'object',
    properties: {
      vacancyId: {
        type: 'number',
        description: 'id вакансии',
      },
    },
    required: ['vacancyId'],
  },
  body: {
    type: 'object',
    properties: {
      name: { properties: { value: { type: 'string', description: 'Ф.И.О.' } } },
      city: { properties: { value: { type: 'string', description: 'Город' } } },
      phone: { properties: { value: { type: 'string', description: 'Номер телефона' } } },
      email: { properties: { value: { type: 'string', description: 'E-mail' } } },
      birthday: {
        properties: { value: { type: 'string', format: 'date', description: 'Дата рождения' } },
      },
      sex: { properties: { value: { enum: ['male', 'female', null], description: 'Пол' } } },
      experience: { properties: { value: { type: 'boolean', description: 'Опыт работы' } } },
      files,
    },
    required: ['name', 'city', 'phone', 'email', 'birthday', 'sex', 'experience'],
  },
  response: {
    200: {
      loyalty: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Тип операции' },
            description: { type: 'string', description: 'Описание операции' },
            amount: { type: 'number', description: 'Кол.во бонусов' },
          },
        },
      },
    },
    204: {
      type: 'null',
    },
    ...openapiResponseError(
      [errorCodes.VALIDATION, { additional: { meta: [] } }],
      [errorCodes.NOT_FOUND, { description: 'Вакансия не найдена', additional: { message: 'string' } }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка', additional: { message: 'string' } }],
    ),
  },
  description: 'Отклик на вакансию (для начисления бонусов нужна авторизация)',
};

module.exports = {
  vacancyResponse,
};
