/* eslint linebreak-style: ["error", "windows"] */

const declineSecondUser = require('application/use_cases/residentProfiles/declineSecondUser');

test('decline second user', async () => {
  // given
  const id = 1;
  const rId = 1;
  const residentProfileId = 37;
  const messageId = 18;

  const result = { success: true };

  const getResidentProfile = {
    id: residentProfileId,
    userId: id,
    confirmed: true,
  };

  const updatedNotification = {
    id: messageId,
    isRead: true,
  };

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.get = jest.fn(() => getResidentProfile);
  mockResidentProfileRepository.remove = jest.fn(() => getResidentProfile);

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
  const res = await declineSecondUser(
    mockServiceLocator,
    {
      id, rId, residentProfileId, messageId,
    },
  );

  // then
  expect(mockResidentProfileRepository.get).toHaveBeenCalledWith(residentProfileId, { fields: ['userId'] });
  expect(mockResidentProfileRepository.remove).toHaveBeenCalledWith(residentProfileId);
  expect(mockUserNotificationsRepository.update).toHaveBeenCalledWith(messageId, { is_read: true });
  expect(mockPushManager.sendToUser).toHaveBeenCalledWith(
    mockServiceLocator,
    {
      userId: id,
      type: 'DECLINE_USER_NOTIFICATION',
      residentProfileId,
    },
  );
  expect(res).toEqual(result);
});
