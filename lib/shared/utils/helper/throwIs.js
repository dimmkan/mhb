const { AppError, errorCodes } = require('shared/errors');

function throwIs(predicate, description) {
  return function check(value) {
    if (predicate(value)) {
      throw new AppError(
        errorCodes.NOT_FOUND,
        description && { description },
      );
    }
    return value;
  };
}

module.exports = throwIs;
