module.exports = (
  { targetViewsRepository },
  { id: targetId, userId, sessionId },
) => (
  targetViewsRepository.existTarget({
    targetId,
    userId: userId || 0,
    sessionId: userId ? '' : sessionId,
  })
);
