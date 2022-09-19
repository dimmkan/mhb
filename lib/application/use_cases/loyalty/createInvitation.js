const { AppError, errorCodes } = require('shared/errors');
const { nanoid } = require('nanoid');
const _ = require('ramda');

module.exports = async function createInvitationUseCase(
  { loyaltyInvitationsRepository, loyaltyManager },
  {
    userId,
    sourceId,
    expirationDate,
    type,
  },
) {
  if (!loyaltyManager.types.all[type]) {
    throw new AppError(errorCodes.BAD_REQUEST);
  }

  if (userId) {
    const invitation = await loyaltyInvitationsRepository.find({
      beneficiary: userId,
      type,
      sourceId,
    })
      .then(_.head);

    if (invitation) return _.pick(['hash', 'expirationDate', 'type', 'sourceId'], invitation);
  }

  return loyaltyInvitationsRepository.persist({
    type,
    sourceId,
    beneficiary: userId,
    hash: nanoid(40),
    expirationDate,
  })
    .then(_.head)
    .then(_.pick(['hash', 'expirationDate', 'type', 'sourceId']));
};
