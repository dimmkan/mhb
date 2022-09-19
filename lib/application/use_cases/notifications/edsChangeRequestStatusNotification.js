const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const edsChangeRequestStatusNotification = async (serviceLocator, data) => {
  const { pushManager, edsProfileRepository } = serviceLocator;
  const userId = _.path(['userId'], await edsProfileRepository.getByEdsId(data.user_id));
  if (!userId) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' });
  const sendData = {
    userId,
    type: notificationEnum.EDS_CHANGE_REQUEST_STATUS,
    ...data,
  };
  return pushManager.sendToUser(serviceLocator, sendData);
};

module.exports = edsChangeRequestStatusNotification;
