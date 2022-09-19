/* eslint linebreak-style: ["error", "windows"] */

const acceptSecondUser = require('application/use_cases/residentProfiles/acceptSecondUser');

test('accept second user', async () => {
  // given
  const id = 1;
  const rId = 1;
  const residentProfileId = 37;
  const messageId = 18;

  const result = { success: true };

  const mergedResidentProfile = {
    id: residentProfileId,
    userId: id,
    confirmed: true,
  };

  const updatedNotification = {
    id: messageId,
    isRead: true,
  };

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.merge = jest.fn(() => mergedResidentProfile);

  const mockPushManager = {};
  mockPushManager.sendToUser = jest.fn(() => result);

  const mockUserNotificationsRepository = {};
  mockUserNotificationsRepository.update = jest.fn(() => updatedNotification);

  const mockServiceLocator = {
    residentProfileRepository: mockResidentProfileRepository,
    pushManager: mockPushManager,
    userNotificationsRepository: mockUserNotificationsRepository,
  };

  // when
  const res = await acceptSecondUser(
    mockServiceLocator,
    {
      id, rId, residentProfileId, messageId,
    },
  );

  // then
  expect(mockResidentProfileRepository.merge).toHaveBeenCalledWith({
    id: residentProfileId,
    confirmed: true,
  });
  expect(mockPushManager.sendToUser).toHaveBeenCalledWith(
    mockServiceLocator,
    {
      userId: id,
      type: 'ACCEPT_USER_NOTIFICATION',
      residentProfileId,
    },
  );
  expect(mockUserNotificationsRepository.update).toHaveBeenCalledWith(messageId, { is_read: true });
  expect(res).toEqual(result);
});
