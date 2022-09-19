/* eslint linebreak-style: ["error", "windows"] */

const addByUserNotification = require('application/use_cases/notifications/addByUserNotification');

test('add notification for once user', async () => {
  // given
  const phone = '+79304095717';
  const title = 'test';
  const body = 'test';

  const result = { success: true };

  const recepientUser = {
    id: 39,
    phone,
  };

  const mockUserRepository = {};
  mockUserRepository.getByPhone = jest.fn(() => recepientUser);

  const mockPushManager = {};
  mockPushManager.sendToUser = jest.fn(() => result);

  const mockServiceLocator = {
    userRepository: mockUserRepository,
    pushManager: mockPushManager,
  };

  // when
  await addByUserNotification(
    mockServiceLocator,
    {
      phone, title, body,
    },
  );

  // then
  expect(mockUserRepository.getByPhone).toHaveBeenCalledWith(phone);
  expect(mockPushManager.sendToUser).toHaveBeenCalledWith(
    mockServiceLocator,
    {
      userId: 39,
      type: 'ADMINISTRATIVE_NOTIFICATION_BY_USER',
      title,
      body,
      residentProfileId: '',
    },
  );
});
