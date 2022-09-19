const fastifyMultipart = require('@fastify/multipart');
const fp = require('fastify-plugin');
const os = require('os');
const { createWriteStream } = require('fs');
const { extname } = require('path');
const { pipeline } = require('stream').promises;
const { nanoid } = require('nanoid');
const { extension } = require('mime-types');

function isAllowedMimetype({ allow }) {
  return allow
    ? (mimetype) => allow.indexOf(mimetype) !== -1
    : () => true;
}

function preValidationHandler(options) {
  const isAllowed = isAllowedMimetype(options);
  const tmpdir = (options && options.tmpdir) || os.tmpdir();

  return async function handler(req) {
    if (!req.isMultipart()) return;

    req.tmpUploads = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const part of req.parts()) {
      req.body = part.fields;

      const { mimetype, file, filename } = part;
      if (file) {
        if (isAllowed(mimetype)) {
          const fileId = nanoid(12);
          const fileExtension = extname(filename) || `.${extension(mimetype)}` || '';
          const filePath = `${tmpdir}/${fileId}${fileExtension}`;
          await pipeline(file, createWriteStream(filePath));
          part.path = filePath;
          req.tmpUploads.push(filePath);
        } else {
          file.resume();
        }
      }
    }
  };
}

function plugin(fastify, options, done) {
  fastify
    .register(fastifyMultipart, options)
    .addHook('preValidation', preValidationHandler(options));

  done();
}

module.exports = fp(plugin, {
  fastify: '>=3.0',
  name: 'fastify-multipart-body-disk',
});
