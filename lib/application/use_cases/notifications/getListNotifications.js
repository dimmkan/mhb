async function getListNotifications({ userNotificationsRepository }, data) {
  const { count } = await userNotificationsRepository.getCountByUserId(data.id);
  const list = await userNotificationsRepository.getByUserId(data);
  return {
    data: list,
    metadata: {
      count: +count,
      pages: Math.ceil(+count / data.limit),
    },
  };
}

module.exports = getListNotifications;
