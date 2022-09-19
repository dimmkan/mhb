const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');

const notify = async (dependencies, { id, userId }) => {
  try {
    const { pushManager } = dependencies;
    await pushManager.sendToUser(dependencies, {
      userId,
      type: notificationEnum.ACCEPT_USER_NOTIFICATION,
      residentProfileId: id,
    });
  } catch (e) {
    // TODO: Сюда необходимо добавить логгирование при ошибках отправки
  }
};

module.exports = async function acceptUser(dependencies, { id }) {
  const { residentProfileRepository } = dependencies;
  const { userId } = await residentProfileRepository.merge({
    id,
    confirmed: true,
  });
  await notify(
    dependencies,
    { id, userId },
  );
  return true;
};
