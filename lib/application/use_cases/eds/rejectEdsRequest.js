const rejectEdsRequest = async (serviceLocator, data) => {
  const { edsExternal } = serviceLocator;
  return edsExternal.confirmOrRejectRequest(data);
};

module.exports = rejectEdsRequest;
