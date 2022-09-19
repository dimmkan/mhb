async function getCountUnreadableUserNotifications({ userNotificationsRepository }, userId) {
  const { count } = await userNotificationsRepository.getCountByUserId(userId, [false]);
  return {
    count: +count,
  };
}

module.exports = getCountUnreadableUserNotifications;
