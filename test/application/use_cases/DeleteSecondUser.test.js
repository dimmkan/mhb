/* eslint linebreak-style: ["error", "windows"] */

const deleteSecondUser = require('application/use_cases/residentProfiles/deleteSecondUser');

test('delete second user', async () => {
  // given
  const userId = 1;
  const profileId = 37;
  const residentId = 86944365;

  const result = { success: true };

  const getResidentProfile = {
    id: profileId,
    userId,
    confirmed: true,
  };

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findChildrensForVerify = jest.fn(() => undefined);
  mockResidentProfileRepository.remove = jest.fn(() => getResidentProfile);

  const mockPushManager = {};
  mockPushManager.sendToUser = jest.fn(() => result);

  const mockServiceLocator = {
    residentProfileRepository: mockResidentProfileRepository,
    pushManager: mockPushManager,
  };

  // when
  const res = await deleteSecondUser(
    mockServiceLocator,
    {
      userId, profileId, profile: { id: profileId, userId, residentId },
    },
  );

  // then
  expect(mockResidentProfileRepository.remove).toHaveBeenCalledWith(profileId);
  expect(mockPushManager.sendToUser).toHaveBeenCalledWith(
    mockServiceLocator,
    {
      userId,
      type: 'DELETE_USER_NOTIFICATION',
      title: 'Удаление лицевого счета',
      body: `Ваш аккаунт был откреплен от Л/С ${residentId} главным пользователем`,
      residentProfileId: profileId,
    },
  );
  expect(res).toEqual(result);
});
