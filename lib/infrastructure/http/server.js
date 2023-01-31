/* eslint-disable global-require */
const env = require('infrastructure/config/env');
const Fastify = require('fastify');

const PREFIX = env.HTTP_API_PREFIX;

const fastify = Fastify({
  logger: true,
  ajv: { customOptions: { allErrors: true, unknownFormats: ['binary', 'int32', 'int64'] } },
})
  .register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
  .register(require('@fastify/cors'), { credentials: true, origin: true })
  .register(require('@fastify/cookie'))
  .register(require('shared/interfaces/http/plugins/fastifyErrorHandler'))
  .register(require('shared/interfaces/http/plugins/fastifyNotFoundErrorHandler'))
  .register(require('interfaces/http/plugins/serviceLocator'))
  .register(require('interfaces/http/plugins/passwordAuth'))
  .register(require('interfaces/http/plugins/bearerAuth'))
  .register(require('interfaces/http/plugins/apiKeyAuth'))
  .register(require('interfaces/http/plugins/bearerAuthOrAnonym'))
  .register(require('interfaces/http/plugins/sanitizeBodyPhone'))
  .register(require('shared/interfaces/http/plugins/fastifySession'), {
    cookieName: env.SESSION_COOKIE_NAME,
    secret: env.SESSION_SECRET,
    cookie: { secure: env.SESSION_COOKIE_SECURE },
  })
  .register(require('interfaces/http/plugins/residentProfile'))
  .register(require('interfaces/ui/plugins/openapi'))
  .after(() => {
    fastify
      .register(require('interfaces/http/handlers/auth'), { prefix: `${PREFIX}/auth` })
      .register(require('interfaces/http/handlers/residentProfiles'), { prefix: `${PREFIX}/resident-profiles` })
      .register(require('interfaces/http/handlers/user'), { prefix: `${PREFIX}/user` })
      .register(require('interfaces/http/handlers/geolocation'), { prefix: `${PREFIX}/geolocation` })
      .register(require('interfaces/http/handlers/notifications'), { prefix: `${PREFIX}/notifications` })
      .register(require('interfaces/http/handlers/appointments'), { prefix: `${PREFIX}/appointments` })
      .register(require('interfaces/http/handlers/appeals'), { prefix: `${PREFIX}/appeals` })
      .register(require('interfaces/http/handlers/polls'), { prefix: `${PREFIX}/polls` })
      .register(require('interfaces/http/handlers/vacancies'), { prefix: `${PREFIX}/vacancies` })
      .register(require('interfaces/http/handlers/news'), { prefix: `${PREFIX}/news` })
      .register(require('interfaces/http/handlers/address'), { prefix: `${PREFIX}/address` })
      .register(require('interfaces/http/handlers/edsServices'), { prefix: `${PREFIX}/eds-services` })
      .register(require('interfaces/http/handlers/eds'), { prefix: `${PREFIX}/eds` })
      .register(require('interfaces/http/handlers/giszhkh'), { prefix: `${PREFIX}/giszhkh` })
      .register(require('interfaces/http/handlers/loyalty'), { prefix: `${PREFIX}/loyalty` })
      .register(require('interfaces/http/handlers/serviceMethods'), { prefix: `${PREFIX}/serviceMethods` });
  });

const start = async () => {
  try {
    await fastify.listen(env.HTTP_API_PORT, env.HTTP_PUBLIC_URL);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

module.exports = { start };
