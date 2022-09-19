const { nanoid } = require('nanoid');

const serverError = {
  description: 'Server error occurred',
  status: 500,
  code: 'SERVER_ERROR',
  descriptionRu: 'Произошла ошибка сервера',
};

module.exports = (error) => ({
  opId: nanoid(6),
  status: error.status || error.statusCode || 500,
  code: error.code || serverError.code,
  message: error.message || serverError.description,
  description: error.description || serverError.description,
  descriptionRu: error.descriptionRu || serverError.descriptionRu,
  meta: error.meta || undefined,
  layer: error.layer || undefined,
  stack: error.stack || undefined,
  src: error.src || undefined,
});
