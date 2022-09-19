module.exports = class NotImplementedError extends Error {
  constructor() {
    super('ERR_METHOD_NOT_IMPLEMENTED');
  }
};
