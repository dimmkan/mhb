const bcrypt = require('bcrypt');

const compare = (str, hash) => bcrypt.compare(str, hash);

const hash = (data) => bcrypt.hash(data, 12);

module.exports = {
  compare,
  hash,
};
