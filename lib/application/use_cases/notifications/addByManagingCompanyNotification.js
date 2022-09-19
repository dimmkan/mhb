const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

async function addByManagingCompanyNotification(serviceLocator, data) {
  const {
    pushManager,
    residentProfileRepository,
  } = serviceLocator;

  const recepientUsers = await residentProfileRepository
    .findAllByManagingCompanyId(data.managingCompanyId)
    .then((result) => result.filter((item) => !!item.residentAccount))
    .then(_.compose(
      _.uniq,
      _.map(_.path(['userId'])),
    ));
  const sendData = {
    userIds: recepientUsers,
    type: data.notificationType || notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_MANAGING_COMPANY,
    ...(_.omit(['notificationType'], data)),
  };
  try {
    return pushManager.sendToUsers(serviceLocator, sendData);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
}

module.exports = addByManagingCompanyNotification;
