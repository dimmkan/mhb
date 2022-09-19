const _ = require('ramda');
const renameObjectKeys = require('shared/utils/helper/renameObjectKeys');

module.exports = async function createReport(
  { targetViewsRepository, targetRateRepository, cmsExternal },
) {
  const values = await Promise.all([
    targetViewsRepository.allCounts(),
    targetRateRepository.allCounts(),
  ]).then(_.compose(
    _.map(_.compose(
      renameObjectKeys({
        targetId: 'id',
        views: 'viewCount',
        likes: 'likeCount',
        dislikes: 'dislikeCount',
      }),
      _.mergeAll,
    )),
    _.values,
    _.groupBy(_.prop('targetId')),
    (r) => r.flat(1),
  ));

  await cmsExternal.updateNewsStatistics(values);

  return true;
};
