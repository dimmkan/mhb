const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { errorCodes, AppError } = require('shared/errors');

const edsPlanningShutdownNotification = async (serviceLocator, data) => {
  const { pushManager, edsProfileRepository } = serviceLocator;
  const userId = _.path(['userId'], await edsProfileRepository.getByEdsId(data.user_id));
  if (!userId) throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' });
  const address = `${data.city}, ${data.district ? `${data.district},` : ''} ${data.street}, ${data.house}`;
  const body = `${data.planed_start_date} по адресу  ${address} будет произведено отключение ${data.subject_resource} c ${data.planed_start_date} по ${data.planed_end_date}`;
  const sendData = {
    userId,
    body,
    type: notificationEnum.EDS_PLANNIG_SHUTDOWN,
    ...data,
  };
  try {
    return pushManager.sendToUser(serviceLocator, sendData);
  } catch (e) {
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = edsPlanningShutdownNotification;
