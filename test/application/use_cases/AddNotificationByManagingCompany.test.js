/* eslint linebreak-style: ["error", "windows"] */

const addByManagingCompanyNotification = require('application/use_cases/notifications/addByManagingCompanyNotification');

test('add notification for topic', async () => {
  // given
  const managingCompanyId = 3;
  const title = 'test';
  const body = 'test';

  const result = { success: true };

  const recepientUsers = [];

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findAllByManagingCompanyId = jest.fn(() => recepientUsers);

  const mockPushManager = {};
  mockPushManager.sendToUsers = jest.fn(() => result);

  const mockServiceLocator = {
    residentProfileRepository: mockResidentProfileRepository,
    pushManager: mockPushManager,
  };

  // when
  await addByManagingCompanyNotification(
    mockServiceLocator,
    {
      managingCompanyId, title, body,
    },
  );

  // then
  expect(mockResidentProfileRepository.findAllByManagingCompanyId)
    .toHaveBeenCalledWith(managingCompanyId);
  expect(mockPushManager.sendToUsers).toHaveBeenCalledWith(
    mockServiceLocator,
    {
      userIds: [],
      type: 'ADMINISTRATIVE_NOTIFICATION_BY_MANAGING_COMPANY',
      title,
      body,
    },
  );
});
