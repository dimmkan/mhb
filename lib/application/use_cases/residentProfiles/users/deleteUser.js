const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const stringFormat = require('shared/utils/helper/stringFormat');
const _ = require('ramda');

const t = Object.freeze({
  title: 'Удаление лицевого счета',
  body: 'Ваш аккаунт был откреплен от Л/С {0} главным пользователем',
});

const notify = async (dependencies, { id, userId, residentId }) => {
  try {
    const { pushManager } = dependencies;
    await pushManager.sendToUser(dependencies, {
      userId,
      type: notificationEnum.DELETE_USER_NOTIFICATION,
      title: t.title,
      body: stringFormat(t.body, residentId),
      residentProfileId: id,
    });
  } catch (e) {
    // TODO: Сюда необходимо добавить логгирование при ошибках отправки
  }
};

module.exports = async function deleteUser(dependencies, { id }) {
  const { residentProfileRepository } = dependencies;

  const profile = await residentProfileRepository.get(id, { fields: ['userId', 'residentId'] });

  await residentProfileRepository.remove(id);
  await notify(dependencies, {
    id,
    userId: profile.userId,
    residentId: profile.residentId,
  });

  return true;
};
