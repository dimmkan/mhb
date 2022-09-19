const { AppError, errorCodes } = require('shared/errors');

module.exports = async function userPointsUseCase(
  { loyaltyOperationsRepository },
  { userId },
) {
  return loyaltyOperationsRepository.userPoints(userId);
};
