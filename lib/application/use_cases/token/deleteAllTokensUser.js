const deleteAllTokensUser = ({ refreshTokenRepository }, userId) => (
  refreshTokenRepository.deleteAllByUserId(userId)
);

module.exports = deleteAllTokensUser;
