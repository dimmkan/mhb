const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');

async function addByUserNotification(serviceLocator, data) {
  const { pushManager, userRepository } = serviceLocator;
  const recepientUser = await userRepository.getByPhone(data.phone);
  const sendData = {
    userId: recepientUser.id,
    type: notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_USER,
    ..._.omit(['phone'], data),
  };
  return pushManager.sendToUser(serviceLocator, sendData);
}

module.exports = addByUserNotification;
