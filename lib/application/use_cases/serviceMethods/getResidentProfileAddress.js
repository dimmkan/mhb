const getResidentProfileAddress = async (serviceLocator, residentId) => {
  const {
    nedolzhnikExternal,
    logger,
  } = serviceLocator;

  try {
    const addressData = await nedolzhnikExternal.getAddress(residentId);
    return addressData.address.toLowerCase().replace(/(_)/g, '');
  } catch (error) {
    logger.warn(error, { type: 'tasks.nedolzhnikExternal.getAddress' });
  }
};

module.exports = getResidentProfileAddress;
