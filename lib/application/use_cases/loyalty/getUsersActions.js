function getUsersActions(serviceLocator, filters) {
  const { loyaltyOperationsRepository } = serviceLocator;
  return loyaltyOperationsRepository.filteredUsersActions(filters);
}

module.exports = getUsersActions;
