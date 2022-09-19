const jose = require('jose');
const { createSecretKey } = require('crypto');
const { errorCodes, AppError } = require('shared/errors');

const signExp = (ms) => Math.trunc((new Date().getTime() + ms) / 1000);

const signJWT = (opts) => {
  const secretKey = createSecretKey(opts.secret);

  return async (object) => new jose
    .SignJWT(object)
    .setProtectedHeader({ alg: opts.algorithm })
    .setExpirationTime(signExp(opts.expiresIn))
    .sign(secretKey)
    .catch((e) => {
      throw new AppError(errorCodes.TOKEN_SIGNED, e);
    });
};

const verifyJWT = (opts) => {
  const secretKey = createSecretKey(opts.secret);

  return async (token) => jose.jwtVerify(token, secretKey)
    .then((r) => r.payload)
    .catch((e) => {
      throw new AppError(errorCodes.TOKEN_VERIFY, e);
    });
};

module.exports = {
  signJWT,
  verifyJWT,
};
