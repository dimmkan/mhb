module.exports = (
  { targetViewsRepository },
  { id: targetId, userId, sessionId },
) => (
  targetViewsRepository.upsert({
    targetId,
    userId: userId || 0,
    sessionId: userId ? '' : sessionId,
  })
);
