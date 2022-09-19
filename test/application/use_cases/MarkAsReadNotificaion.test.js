/* eslint linebreak-style: ["error", "windows"] */

const markReadNotification = require('application/use_cases/notifications/markReadNotification');

test('mark notification as read - mark', async () => {
  // given
  const userId = 39;
  const messageId = 44;

  const markedNotification = {
    id: messageId,
    userId,
    isRead: true,
  };

  const result = { success: true };

  const mockUserNotificationsRepository = {};
  mockUserNotificationsRepository.getForMark = jest.fn(() => markedNotification);
  mockUserNotificationsRepository.update = jest.fn(() => markedNotification);

  const mockServiceLocator = {
    userNotificationsRepository: mockUserNotificationsRepository,
  };

  // when
  const res = await markReadNotification(mockServiceLocator, userId, messageId);

  // then
  expect(mockUserNotificationsRepository.getForMark)
    .toHaveBeenCalledWith(userId, messageId);

  expect(mockUserNotificationsRepository.update)
    .toHaveBeenCalledWith(messageId, { isRead: true });

  expect(res).toEqual(result);
});
