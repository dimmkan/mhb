const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

async function addByAddressOssNotification(serviceLocator, data) {
  const {
    pushManager,
    residentProfileRepository,
  } = serviceLocator;

  const profiles = await residentProfileRepository.findAllByAddress(data.address);
  const recepientUsers = _.map(_.path(['userId']), profiles.filter((value) => value.residentAccount.address));
  const endDate = new Date(data.payload.endDate);
  let body = `До ${endDate.toLocaleString('ru')} будет проводиться собрание собственников по теме "${data.payload.subject}"`;
  body += data.payload.meetingLink ? `, возможно проголосовать онлайн на сайте ${data.payload.meetingLink} .` : ' .';
  const sendData = {
    userIds: recepientUsers,
    type: notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS_FOR_OSS,
    body,
    ...data.payload,
  };
  try {
    return pushManager.sendToUsers(serviceLocator, sendData);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
}

module.exports = addByAddressOssNotification;
