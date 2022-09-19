/* eslint linebreak-style: ["error", "windows"] */

const deleteResidentProfile = require('application/use_cases/residentProfiles/deleteResidentProfile');

test('delete resident profile', async () => {
  // given
  const userId = 1;
  const profileId = 37;
  const residentId = '86944365';

  const result = { success: true };

  const getResidentProfile = {
    id: profileId,
    userId,
    confirmed: true,
  };

  const getProfile = {
    id: profileId,
    userId,
    confirmed: true,
    residentId,
  };

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findChildrensForVerify = jest.fn(() => undefined);
  mockResidentProfileRepository.get = jest.fn(() => getProfile);
  mockResidentProfileRepository.remove = jest.fn(() => getResidentProfile);

  const mockServiceLocator = {
    residentProfileRepository: mockResidentProfileRepository,
  };

  // when
  const res = await deleteResidentProfile(
    mockServiceLocator,
    {
      userId, profileId, profile: { id: profileId },
    },
  );

  // then
  expect(mockResidentProfileRepository.get).toHaveBeenCalledWith(profileId);
  expect(mockResidentProfileRepository.findChildrensForVerify)
    .toHaveBeenCalledWith(userId, residentId);
  expect(mockResidentProfileRepository.remove).toHaveBeenCalledWith(profileId);
  expect(res).toEqual(result);
});
