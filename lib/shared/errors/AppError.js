/* eslint-disable no-underscore-dangle */
module.exports = class AppError extends Error {
  constructor(opts, clarifyOpts) {
    super();
    const _opts = clarifyOpts
      ? Object.assign(opts, clarifyOpts)
      : opts;
    this.description = _opts.description;
    this.message = _opts.message || this.description;
    this.status = _opts.status;
    this.code = _opts.code;
    this.layer = _opts.layer;
    this.meta = _opts.meta;
    this.req = _opts.req;
    this.origin = _opts.origin; // origin error data
    this.descriptionRu = _opts.descriptionRu;
  }
};
