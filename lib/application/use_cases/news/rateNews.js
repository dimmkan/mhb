const rateEnum = {
  LIKE: 1,
  DISLIKE: -1,
  NEUTRAL: 0,
};

module.exports = async (
  { targetRateRepository, cmsExternal },
  {
    id: targetId,
    rate,
    userId,
    sessionId,
  },
) => {
  await targetRateRepository.upsert({
    targetId,
    rate: rateEnum[rate],
    userId: userId || 0,
    sessionId: userId ? '' : sessionId,
  });

  const ratePayload = await targetRateRepository.targetRateValue({ targetId, userId, sessionId });

  await cmsExternal.updateNewsStatistics([{
    id: parseInt(targetId, 10),
    likeCount: ratePayload.likes,
    dislikeCount: ratePayload.dislikes,
  }])
    .catch(() => {}); // If cmsExternal is down

  return ratePayload;
};
