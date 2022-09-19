const rateNews = {
  tags: ['news'],
  description: 'rateNews',
  properties: { newsId: { type: 'number' } },
  body: {
    type: 'object',
    properties: {
      rate: { enum: ['LIKE', 'NEUTRAL', 'DISLIKE'] },
    },
    required: ['rate'],
  },
};

const news = {
  tags: ['news'],
  description: 'news',
  properties: { newsId: { type: 'number' } },
};

const newsMarkRead = {
  tags: ['news'],
  description: 'newsMarkRead',
  properties: { newsId: { type: 'number' } },
};

module.exports = {
  news,
  rateNews,
  newsMarkRead,
};
