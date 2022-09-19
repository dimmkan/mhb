const camelCase = require('camelcase');

module.exports = (obj) => Object
  .keys(obj)
  .reduce(
    (acc, key) => {
      acc[camelCase(key)] = obj[key];
      return acc;
    },
    {},
  );
