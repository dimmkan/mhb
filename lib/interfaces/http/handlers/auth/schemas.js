const email = { type: 'string', format: 'email' };
const phone = { type: 'string', minLength: 8 };
const residentId = { type: 'string', maxLength: 8, minLength: 8 };
const paidByReceipt = { type: 'number' };
const password = { type: 'string', minLength: 5 };
const fullName = { type: 'string', minLength: 2 };
const code = { type: 'string' };

const registrationRequest = {
  tags: ['auth'],
  summary: 'Запрос на регистрацию c подтверждением по смс коду',
  description: 'Запрос на регистрацию c подтверждением по смс коду',
  body: {
    type: 'object',
    properties: {
      email,
      phone,
      residentId,
      paidByReceipt,
      password,
      fullName,
    },
    required: [
      'email',
      'phone',
      'residentId',
      'paidByReceipt',
      'password',
      'fullName',
    ],
  },
  response: {
    204: {
      type: 'null',
    },
  },
};

const registration = {
  tags: ['auth'],
  summary: 'Завершение регистрации с подтверждением по смс коду',
  description: 'Завершение регистрации с подтверждением по смс коду',
  body: {
    type: 'object',
    properties: {
      phone,
      code,
    },
    required: ['phone', 'code'],
  },
  response: {
    200: {
      refreshToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
      accessToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
    },
  },
};

const refresh = {
  tags: ['auth'],
  summary: 'Обновление пары токенов',
  description: 'Обновление пары токенов',
  body: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
    },
    required: ['refreshToken'],
  },
  response: {
    200: {
      refreshToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
      accessToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
    },
  },
};

const login = {
  tags: ['auth'],
  summary: 'Авторизация',
  description: 'Авторизация (получение пары токенов доступа)',
  body: {
    type: 'object',
    properties: {
      phone,
      password,
    },
    required: ['phone', 'password'],
  },
  response: {
    200: {
      refreshToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
      accessToken: {
        type: 'string',
        example: 'HHHHHH.PPPPPP.SSSSSS',
      },
    },
  },
};

const logout = {
  tags: ['auth'],
  summary: 'Завершение сессии',
  description: 'Закрытие сессии и уничтожение пары токенов доступа',
  security: [{ bearerAuth: [] }],
  response: {
    204: {
      type: 'null',
    },
  },
};

const resetPasswordEmailRequest = {
  tags: ['auth'],
  summary: 'Запрос на сброс пароля по коду из эл.почты',
  description: 'Запрос на сброс пароля по коду из эл.почты',
  body: {
    type: 'object',
    properties: {
      email,
      password,
    },
    required: ['email', 'password'],
  },
  response: {
    204: {
      type: 'null',
    },
  },
};

const resetPasswordEmail = {
  tags: ['auth'],
  summary: 'Завершение сброса пароля по коду из эл.почты',
  description: 'Завершение сброса пароля по коду из эл.почты',
  body: {
    type: 'object',
    properties: {
      email,
      code,
    },
    required: ['email', 'code'],
  },
  response: {
    204: {
      type: 'null',
    },
  },
};

const resetPasswordPhoneRequest = {
  tags: ['auth'],
  summary: 'Запрос на сброс пароля по коду из смс',
  description: 'Запрос на сброс пароля по коду из смс',
  body: {
    type: 'object',
    properties: {
      phone,
      password,
    },
    required: ['phone', 'password'],
  },
  response: {
    204: {
      type: 'null',
    },
  },
};

const resetPasswordPhone = {
  tags: ['auth'],
  summary: 'Завершение сброса пароля по коду из смс',
  description: 'Завершение сброса пароля по коду из смс',
  body: {
    type: 'object',
    properties: {
      phone,
      code,
    },
    required: ['phone', 'code'],
  },
  response: {
    204: {
      type: 'null',
    },
  },
};

module.exports = {
  registrationRequest,
  registration,
  login,
  logout,
  refresh,
  resetPasswordEmailRequest,
  resetPasswordEmail,
  resetPasswordPhoneRequest,
  resetPasswordPhone,
};
