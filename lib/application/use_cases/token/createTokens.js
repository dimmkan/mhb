const { nanoid } = require('nanoid');
const env = require('infrastructure/config/env');

const refreshTokenExpireDate = () => new Date(
  new Date().getTime() + env.EXPIRE_REFRESH,
);

const createTokens = ({ refreshTokenRepository, jwtTokenManager }) => {
  const createAccessToken = jwtTokenManager.signJWT({
    secret: env.SECRET_ACCESS,
    algorithm: env.ALGORITHM_ACCESS,
    expiresIn: env.EXPIRE_ACCESS,
  });

  const createRefreshToken = jwtTokenManager.signJWT({
    secret: env.SECRET_REFRESH,
    algorithm: env.ALGORITHM_REFRESH,
    expiresIn: env.EXPIRE_REFRESH,
  });

  return async ({ userId, ipAddress, agent }) => {
    const refreshKey = nanoid(20);
    const refreshToken = await createRefreshToken({ id: userId, key: refreshKey });

    const refreshStoreObject = await refreshTokenRepository.persist(
      {
        userId,
        key: refreshKey,
        agent,
        createdByIp: ipAddress,
        expires: refreshTokenExpireDate(),
      },
    );

    const accessToken = await createAccessToken({
      id: userId,
      rId: refreshStoreObject.id,
    });

    return { accessToken, refreshToken };
  };
};

module.exports = createTokens;
