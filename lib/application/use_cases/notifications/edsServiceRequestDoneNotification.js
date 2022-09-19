const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');
const { validate: isValidUUID } = require('uuid');

const calculatePoints = (value, percentOfValue) => parseInt(
  ((value * (percentOfValue / 100)) || 0) * 100,
  10,
);

const edsServiceRequestDoneNotification = async (dependencies, data) => {
  const {
    edsServicesProfileRepository,
    loyaltyOperationsRepository,
    pushManager,
    loyaltyManager,
    logger,
  } = dependencies;

  const userId = await edsServicesProfileRepository.getByEdsServicesId(data.user_id).then(_.prop('user_id'));
  if (!userId) {
    throw new AppError(errorCodes.BAD_REQUEST, { description: 'User ID not found!' });
  }
  if (data.transaction_id && !isValidUUID(data.transaction_id)) {
    throw new AppError(errorCodes.BAD_REQUEST, { description: 'Bad transaction_id' });
  }
  try {
    if (data.transaction_id) {
      await loyaltyOperationsRepository.merge(
        { transactionId: data.transaction_id },
        { approved: true },
      );
    }

    const amount = calculatePoints(data.sum, 1);
    if (amount) {
      await loyaltyManager.debit(dependencies, {
        ...loyaltyManager.types.user.EDS_SERVICES_REQ,
        userId,
        source: 'eds',
        sourceId: data.item_id,
        amount,
      });
    }
  } catch (e) {
    logger.warn(e, {
      input: data,
      type: 'loyaltyManager.notifications.edsServiceRequestDoneNotification',
    });
  }

  return pushManager.sendToUser(dependencies, {
    userId,
    type: notificationEnum.EDS_SERVICE_REQUEST_DONE,
    ...data,
  });
};

module.exports = edsServiceRequestDoneNotification;
