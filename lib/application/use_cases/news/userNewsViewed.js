module.exports = (
  { targetViewsRepository },
  { id: targetIds, userId, sessionId },
) => (
  targetViewsRepository.existTargets({
    targetIds,
    userId: userId || 0,
    sessionId: userId ? '' : sessionId,
  })
);
