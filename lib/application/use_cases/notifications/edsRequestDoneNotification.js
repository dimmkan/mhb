const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const edsRequestDoneNotification = async (dependencies, data) => {
  const {
    pushManager, edsProfileRepository,
  } = dependencies;
  const userId = _.path(['userId'], await edsProfileRepository.getByEdsId(data.user_id));
  if (!userId) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' });
  const sendData = {
    userId,
    type: notificationEnum.EDS_REQUEST_DONE,
    ...data,
  };

  return pushManager.sendToUser(dependencies, sendData);
};

module.exports = edsRequestDoneNotification;
