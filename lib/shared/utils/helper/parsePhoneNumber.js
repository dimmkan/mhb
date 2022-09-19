const libphonenumberjs = require('libphonenumber-js/max');
const { errorCodes: { UNPROCESSABLE_ENTITY }, AppError } = require('shared/errors');

const parsePhoneNumber = (phone, country = 'RU') => {
  const meta = libphonenumberjs(phone, country);
  if (meta && meta.isValid()
  && meta.country === country
  && meta.getType() === 'MOBILE'
  ) {
    return meta.number;
  }
  throw new AppError(
    UNPROCESSABLE_ENTITY,
    { description: 'Bad phone' },
  );
};

module.exports = parsePhoneNumber;
