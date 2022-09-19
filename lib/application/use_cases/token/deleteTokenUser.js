const deleteTokenUser = ({ refreshTokenRepository }, refreshTokenId, userId) => (
  refreshTokenRepository.deleteByIdAndUserId(refreshTokenId, userId)
);

module.exports = deleteTokenUser;
