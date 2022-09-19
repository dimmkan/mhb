const packageJson = require('../../../../../../package.json');

module.exports = {
  title: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
};
