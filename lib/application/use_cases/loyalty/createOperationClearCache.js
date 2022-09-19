module.exports = async function createInvitationUseCase(
  { loyaltyOperationsRepository },
  { expireInSeconds },
) {
  return loyaltyOperationsRepository.closeNonApproved({ expireInSeconds });
};
