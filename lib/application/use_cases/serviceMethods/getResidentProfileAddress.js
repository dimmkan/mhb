const getResidentProfileAddress = async (serviceLocator, residentId) => {
  const {
    nedolzhnikExternal,
  } = serviceLocator;

  const addressData = await nedolzhnikExternal.getAddress(residentId);
  return addressData.address.toLowerCase().replace(/(_)/g, '');
};

module.exports = getResidentProfileAddress;
