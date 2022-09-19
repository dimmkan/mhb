const { errorCodes, openapiResponseError } = require('shared/errors');

const email = { type: 'string', format: 'email' };
const phone = { type: 'string', minLength: 8 };
const code = { type: 'string' };
const password = { type: 'string', minLength: 5 };
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

const user = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'user',
};

const patchProfile = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'patchProfile',
  body: {
    type: 'object',
    properties: {
      birthday: { type: 'string', format: 'date' },
      fullName: { type: 'string', minLength: 2 },
      sex: { enum: ['male', 'female', null] },
    },
  },
};

const changePassword = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'changePassword',
  body: {
    type: 'object',
    properties: {
      password,
      newPassword: password,
    },
    required: ['password', 'newPassword'],
  },
};

const changePhoneRequest = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'changePhoneRequest',
  body: {
    type: 'object',
    properties: { phone },
  },
};

const changePhone = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'changePhone',
  body: {
    type: 'object',
    properties: { code },
  },
};

const changeEmailRequest = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'changeEmailRequest',
  body: {
    type: 'object',
    properties: { email },
  },
};

const changeEmail = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'changeEmail',
  body: {
    type: 'object',
    properties: { code },
  },
};

const avatar = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'avatar',
  body: {
    type: 'object',
    properties: {
      file: imageFile,
    },
    required: ['file'],
  },
};

const passport = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'passport',
  body: {
    type: 'object',
    properties: {
      birthday: { properties: { value: { type: 'string', format: 'date' } } },
      city: { properties: { value: { type: 'string' } } },
      issueDate: { properties: { value: { type: 'string', format: 'date' } } },
      series: { properties: { value: { type: 'string' } } },
      number: { properties: { value: { type: 'string' } } },
      unitCode: { properties: { value: { type: 'string' } } },
      issuedBy: { properties: { value: { type: 'string' } } },
      registrationAddress: { properties: { value: { type: 'string' } } },
      file: imageFile,
    },
    required: [
      'birthday',
      'city',
      'issueDate',
      'series',
      'number',
      'unitCode',
      'issuedBy',
      'registrationAddress',
    ],
  },
};

const getAvatar = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Get user avatar data',
};

const deleteAvatar = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Удалить аватар пользователя',
};

const getPassport = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Get user passport data',
};

const filteredUserList = {
  tags: ['user'],
  description: 'Список пользователей с Л/С и фильтрацией',
  summary: 'Список пользователей с Л/С и фильтрацией',
  security: [{ apiKey: [] }],
};

const deleteUser = {
  tags: ['user'],
  security: [{ bearerAuth: [] }],
  descriptions: 'Удалить учетную запись пользователя',
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
    ...openapiResponseError(
      [errorCodes.HAS_SECOND_USER, { description: 'Учетная запись имеет вторичных пользователей' }],
      [errorCodes.INTERNAL_SERVER_ERROR, { description: 'Внутренняя ошибка сервера' }],
    ),
  },
};

module.exports = {
  patchProfile,
  changePassword,

  changePhoneRequest,
  changePhone,

  changeEmailRequest,
  changeEmail,

  getAvatar,
  avatar,

  getPassport,
  passport,

  user,
  filteredUserList,

  deleteAvatar,
  deleteUser,
};
