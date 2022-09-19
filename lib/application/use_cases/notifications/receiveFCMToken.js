async function receiveFCMToken({ userNotificationTokensRepository }, data) {
  await userNotificationTokensRepository.upsertFCMToken(data);
}

module.exports = receiveFCMToken;
