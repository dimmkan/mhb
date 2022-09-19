const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

module.exports = async function cashoutInvitationUseCase(dependencies, {
  userId,
  hash,
}) {
  const { loyaltyInvitationsRepository, loyaltyManager } = dependencies;

  const invitation = await loyaltyInvitationsRepository.find({ hash }).then(_.head);
  if (!invitation
    || (invitation && !loyaltyManager.types.all[invitation.type])
    || (invitation && userId === invitation.beneficiary)) {
    throw new AppError(errorCodes.BAD_REQUEST);
  }
  const {
    type,
    beneficiary,
    sourceId,
  } = invitation;

  const opResult = await loyaltyManager.onceDebit(dependencies, {
    ...loyaltyManager.types.all[type],
    userId: beneficiary || userId,
    sourceId,
    fingerprint: `${userId}:${hash}`,
  });

  return { success: opResult };
};
