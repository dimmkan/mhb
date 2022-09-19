/* eslint linebreak-style: ["error", "windows"] */
const markReadNotification = require('application/use_cases/notifications/markReadNotification');

test('mark notification as read - exception', async () => {
  // given
  const userId = 39;
  const messageId = 44;

  const markedNotification = undefined;

  const mockUserNotificationsRepository = {};
  mockUserNotificationsRepository.getForMark = jest.fn(() => markedNotification);

  const mockServiceLocator = {
    userNotificationsRepository: mockUserNotificationsRepository,
  };

  // when
  expect(markReadNotification(mockServiceLocator, userId, messageId))
    .rejects
    .toThrow(/Message not found/);
});
