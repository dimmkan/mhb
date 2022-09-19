const registrationRequestClearCache = async (
  { confirmationTokenRepository },
  { expiresInSeconds },
) => confirmationTokenRepository.deleteByExpiresIn(expiresInSeconds);

module.exports = registrationRequestClearCache;
