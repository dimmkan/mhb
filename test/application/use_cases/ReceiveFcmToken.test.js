/* eslint linebreak-style: ["error", "windows"] */

const receiveFCMToken = require('application/use_cases/notifications/receiveFCMToken');

test('recieve FCM token', async () => {
  // given
  const id = 39;
  const FCMToken = 'dsjfhdskjfh2834-8239yhjdhbsjkfh23yuhd943t-sdjfhsdkfj7832rgjhsad-02384yuhewj';

  const result = { success: true };

  const mockUserNotificationTokensRepository = {};
  mockUserNotificationTokensRepository.upsertFCMToken = jest.fn(() => result);

  const mockServiceLocator = {
    userNotificationTokensRepository: mockUserNotificationTokensRepository,
  };

  // when
  await receiveFCMToken(
    mockServiceLocator,
    {
      id,
      FCMToken,
    },
  );

  // then
  expect(mockUserNotificationTokensRepository.upsertFCMToken).toHaveBeenCalledWith({
    id, FCMToken,
  });
});
