const orm = require('infrastructure/orm/objection');
const tasks = require('infrastructure/tasks');

module.exports = {
  async init(dependencies) {
    await orm.run();
    await tasks.run(dependencies);
  },
};
