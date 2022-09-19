const _ = require('ramda');

module.exports = _.anyPass([_.isEmpty, _.isNil]);
