const env = require('infrastructure/config/env');

const verifyAccessToken = ({ jwtTokenManager }) => jwtTokenManager.verifyJWT({
  secret: env.SECRET_ACCESS,
  algorithm: env.ALGORITHM_ACCESS,
});

module.exports = verifyAccessToken;
