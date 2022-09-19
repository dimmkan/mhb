const confirmEdsRequest = async (serviceLocator, data) => {
  const { edsExternal, loyaltyManager, logger } = serviceLocator;
  await loyaltyManager.debit(serviceLocator, {
    ...loyaltyManager.types.user.EDS_REQ_CLOSE,
    userId: data.userId,
    source: 'eds',
    sourceId: data.requestId,
  }).catch((e) => {
    logger.warn(
      e,
      {
        input: {
          ...loyaltyManager.types.user.EDS_REQ_CLOSE,
          userId: data.userId,
          source: 'eds',
          sourceId: data.requestId,
        },
        type: 'loyaltyManager.notifications.edsRequestDoneNotification',
      },
    );
  });
  return edsExternal.confirmOrRejectRequest(data);
};

module.exports = confirmEdsRequest;
