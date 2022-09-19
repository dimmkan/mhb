function getInvitations(serviceLocator, filters) {
  const { loyaltyInvitationsRepository } = serviceLocator;
  return loyaltyInvitationsRepository.getFilteredList(filters);
}

module.exports = getInvitations;
