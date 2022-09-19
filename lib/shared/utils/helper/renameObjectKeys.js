const _ = require('ramda');

module.exports = _.curry((keysMap, obj) => Object
  .keys(obj)
  .reduce(
    (acc, key) => {
      acc[keysMap[key] || key] = obj[key];
      return acc;
    },
    {},
  ));
