module.exports = async function createInvitationUseCase(
  { loyaltyInvitationsRepository },
) {
  return loyaltyInvitationsRepository.deleteExpired();
};
