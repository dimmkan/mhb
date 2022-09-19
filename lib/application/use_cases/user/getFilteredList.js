function getFilteredUsersList(serviceLocator, filters) {
  const { userRepository } = serviceLocator;
  return userRepository.getFilteredUsersList(filters);
}

module.exports = getFilteredUsersList;
