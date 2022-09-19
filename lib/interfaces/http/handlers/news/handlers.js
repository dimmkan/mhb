const _ = require('ramda');
const directusComposition = require('shared/utils/helper/directusComposition');
const newsRatings = require('application/use_cases/news/newsRatings');
const rateNews = require('application/use_cases/news/rateNews');
const userViewed = require('application/use_cases/news/userViewed');
const markReadNews = require('application/use_cases/news/markReadNews');
const userNewsViewed = require('application/use_cases/news/userNewsViewed');

/** TODO:
 * include merge logic to fields ops
 */
const newsItemWithUserMetaHandler = ({ serviceLocator }) => directusComposition(
  serviceLocator.cmsExternal.news,
  {
    userRating: ({ req }) => newsRatings(serviceLocator, {
      id: req.params.newsId,
      userId: (req.isAuth && req.authCredentials.id),
      sessionId: req.session.sessionId,
    }),
    viewed: ({ req }) => userViewed(serviceLocator, {
      id: req.params.newsId,
      userId: (req.isAuth && req.authCredentials.id),
      sessionId: req.session.sessionId,
    }),
  },
  ({ result, fields }) => ({ ...result, data: { ...result.data, ...fields } }),
);

/** TODO:
 * include merge logic to fields ops
 */
const newsWithUserMetaHandler = ({ serviceLocator }) => directusComposition(
  serviceLocator.cmsExternal.news,
  {
    userRating: ({ result, req }) => newsRatings(serviceLocator, {
      id: _.pluck('id', result.data),
      userId: (req.isAuth && req.authCredentials.id),
      sessionId: req.session.sessionId,
    }),
    viewed: ({ result, req }) => userNewsViewed(serviceLocator, {
      id: _.pluck('id', result.data),
      userId: (req.isAuth && req.authCredentials.id),
      sessionId: req.session.sessionId,
    }),
  },
  ({ result: { data, ...meta }, fields }) => ({
    ...meta,
    data: data.map((item) => {
      if (fields.userRating) {
        item.userRating = _.pick( // eslint-disable-line no-param-reassign
          ['rate'],
          fields.userRating.find((x) => x.targetId === item.id) || { rate: 'NEUTRAL' },
        );
      }
      if (fields.viewed) {
        item.viewed = Boolean(fields.viewed.find((x) => x.targetId === item.id)); // eslint-disable-line no-param-reassign, max-len
      }
      return item;
    }),
  }),
);

function rateNewsHandler(req) {
  return rateNews(this.serviceLocator, {
    ...req.body,
    id: req.params.newsId,
    userId: (req.isAuth && req.authCredentials.id),
    sessionId: req.session.sessionId,
  });
}

async function traceNewsViewHandler(req, reply) {
  await markReadNews(this.serviceLocator, {
    id: req.params.newsId,
    userId: (req.isAuth && req.authCredentials.id),
    sessionId: req.session.sessionId,
  });

  return reply.code(204).send();
}

module.exports = {
  newsItemWithUserMetaHandler,
  rateNewsHandler,
  traceNewsViewHandler,
  newsWithUserMetaHandler,
};
