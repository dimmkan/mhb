const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');

const notify = async (dependencies, { id, userId }) => {
  try {
    const { pushManager } = dependencies;
    await pushManager.sendToUser(dependencies, {
      userId,
      type: notificationEnum.DECLINE_USER_NOTIFICATION,
      residentProfileId: id,
    });
  } catch (e) {
    // TODO: Сюда необходимо добавить логгирование при ошибках отправки
  }
};

module.exports = async function declineUser(dependencies, { id }) {
  const { residentProfileRepository } = dependencies;
  const profile = await residentProfileRepository.get(id, { fields: ['userId'] });
  await residentProfileRepository.remove(id);
  await notify(
    dependencies,
    { id, userId: profile.userId },
  );

  return true;
};
