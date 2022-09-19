const { AppError, errorCodes } = require('shared/errors');

async function markReadNotification({ userNotificationsRepository }, userId, messageId) {
  const notification = await userNotificationsRepository.getForMark(userId, messageId);
  if (notification) {
    await userNotificationsRepository.update(notification.id, { isRead: true });
    return { success: true };
  }
  throw new AppError(
    errorCodes.BAD_REQUEST,
    { description: 'Message not found' },
  );
}

module.exports = markReadNotification;
