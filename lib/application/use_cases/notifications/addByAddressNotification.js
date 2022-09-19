const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

async function addByAddressNotification(serviceLocator, data) {
  const {
    pushManager,
    residentProfileRepository,
  } = serviceLocator;

  const profiles = await residentProfileRepository.findAllByAddress(data.address.flat ? data.address : _.omit(['flat', 'flatType'], data.address));
  const recepientUsers = _.map(_.path(['userId']), profiles.filter((value) => (data.address.flat && value.residentAccount.address ? value.residentAccount.address.flat === data.address.flat : value.residentAccount.address)));
  const sendData = {
    userIds: recepientUsers,
    type: data.payload.notificationType || notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS,
    ...(_.omit(['notificationType'], data.payload)),
  };
  try {
    return pushManager.sendToUsers(serviceLocator, sendData);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
}

module.exports = addByAddressNotification;
