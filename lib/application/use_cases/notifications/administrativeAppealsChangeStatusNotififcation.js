const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');

async function administrativeAppealsChangeStatusNotififcation(serviceLocator, data) {
  const { pushManager, userRepository } = serviceLocator;
  const recepientUser = await userRepository.getByPhone(data.phone);
  if (!recepientUser) return { success: false };
  const sendData = {
    userId: recepientUser.id,
    type: notificationEnum.ADMINISTRATIVE_APPEALS_CHANGE_STATUS,
    ..._.omit(['phone'], data),
  };
  return pushManager.sendToUser(serviceLocator, sendData);
}

module.exports = administrativeAppealsChangeStatusNotififcation;
