const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const stringFormat = require('shared/utils/helper/stringFormat');

const t = {
  title: 'Удаление лицевого счета',
  body: 'Ваш аккаунт был откреплен от Л/С {0} главным пользователем',
};

const notify = async (dependencies, { userIds, residentId }) => {
  try {
    const { pushManager } = dependencies;
    await pushManager.sendToUsers(dependencies, {
      userIds,
      type: notificationEnum.DELETE_USER_NOTIFICATION,
      title: t.title,
      body: stringFormat(t.body, residentId),
      residentId,
    });
  } catch (e) {
    // TODO: Сюда необходимо добавить логгирование при ошибках отправки
  }
};

module.exports = async function deleteAllResidentProfileUsers(dependencies, { id }) {
  const { residentProfileRepository } = dependencies;

  const childrens = await residentProfileRepository.findChildrens(id);
  if (!childrens.length) return false;

  await residentProfileRepository.removeMany(_.pluck('id', childrens));

  await notify(dependencies, {
    userIds: _.pluck('userId', childrens),
    residentId: _.path([0, 'residentId'], childrens),
  });

  return true;
};
