const { nanoid } = require('nanoid');
const env = require('infrastructure/config/env');
const { AppError, errorCodes } = require('shared/errors');
const { DateTime } = require('luxon');

const refreshTokenExpireDate = () => new Date(
  new Date().getTime() + env.EXPIRE_REFRESH,
);

const refreshTokens = (dependencies) => {
  const { jwtTokenManager, refreshTokenRepository, loyaltyManager } = dependencies;
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

  const verifyRefreshToken = jwtTokenManager.verifyJWT({
    secret: env.SECRET_REFRESH,
    algorithm: env.ALGORITHM_REFRESH,
  });

  const checkRefreshTokenStatus = async (token) => {
    const payload = await verifyRefreshToken(token);
    const refreshSession = await refreshTokenRepository.findByKey(payload.key);

    return (refreshSession)
      ? { status: 'VALID', session: refreshSession }
      : { status: 'COMPROMISED', payload };
  };

  return async ({ token, ipAddress, agent }) => {
    try {
      const { status, payload, session } = await checkRefreshTokenStatus(token);
      if (status === 'VALID') {
        const refreshKey = nanoid(20);
        const refreshToken = await createRefreshToken({ id: session.userId, key: refreshKey });

        await refreshTokenRepository.merge(
          {
            id: session.id,
            key: refreshKey,
            agent,
            createdByIp: ipAddress,
            expires: refreshTokenExpireDate(),
          },
        );

        const accessToken = await createAccessToken({
          id: session.userId,
          rId: session.id,
        });

        await loyaltyManager.onceDebit(dependencies, {
          userId: session.userId,
          ...loyaltyManager.types.user.ACTIVITY,
          fingerprint: `${session.userId}:${DateTime.local().setZone('Europe/Moscow').toFormat('yyyy-MM-dd')}`,
        });

        return { accessToken, refreshToken };
      }

      if (status === 'COMPROMISED') {
        await refreshTokenRepository.deleteAllByUserId(payload.id);
        throw new Error(status);
      }
    } catch (e) {
      throw new AppError(errorCodes.BAD_REFRESH_TOKEN);
    }
  };
};

module.exports = refreshTokens;
