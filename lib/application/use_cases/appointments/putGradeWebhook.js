const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');

const putGradeWebhook = async (
  serviceLocator,
  requestBody,
) => {
  const {
    id,
    idUser,
    status,
    type,
    theme,
    date,
  } = requestBody;

  if (status !== '1') return { success: true };

  const {
    pushManager,
  } = serviceLocator;

  const formatedDate = new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const notificationType = type === '0'
    ? notificationEnum.RATE_QUALITY_NOTIFICATION
    : notificationEnum.RATE_APPEAL_QUALITY_NOTIFICATION;

  const sendData = {
    itemId: id,
    userId: idUser,
    type: notificationType,
    theme,
    date: formatedDate,
  };

  return pushManager.sendToUser(serviceLocator, sendData);
};

module.exports = putGradeWebhook;
