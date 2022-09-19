const getAppeals = require('application/use_cases/appeals/getAppeals');

test('get appeals list', async () => {
  const response = {
    success: true,
    data: {
      Appointments: [],
    },
  };
  const id = 7;
  const residentId = '86944365';
  const resident = [
    {
      residentAccount: {
        managingCompanyId: 1,
        address: {
          source: '123',
          result: '123',
        },
      },
    },
  ];

  const managingCompany = {
    url: 'test',
    code: 'ЖС',
  };

  const user = {
    profile: {
      fullName: 'IVAN',
    },
  };

  const mockUppOrnExternal = {};
  mockUppOrnExternal.setUrl = jest.fn(() => undefined);
  mockUppOrnExternal.getAppeals = jest.fn(() => response);

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findByResidentIdAndUserId = jest.fn(() => resident);

  const mockCmsExternal = {};
  mockCmsExternal.getManagingCompanyById = jest.fn(() => managingCompany);

  const mockUserRepository = {};
  mockUserRepository.get = jest.fn(() => user);

  const mockServiceLocator = {
    uppOrnExternal: mockUppOrnExternal,
    residentProfileRepository: mockResidentProfileRepository,
    cmsExternal: mockCmsExternal,
    userRepository: mockUserRepository,
  };

  // when
  const res = await getAppeals(
    mockServiceLocator,
    id,
    residentId,
  );

  // then
  expect(mockUppOrnExternal.setUrl).toHaveBeenCalledWith(managingCompany.url);
  expect(mockUppOrnExternal.getAppeals)
    .toHaveBeenCalledWith(
      residentId,
      user.profile.fullName,
      resident.residentAccount.address.result,
    );
  expect(mockResidentProfileRepository.findByResidentIdAndUserId)
    .toHaveBeenCalledWith(residentId, id);
  expect(mockCmsExternal.getManagingCompanyById)
    .toHaveBeenCalledWith(resident.residentAccount.managingCompanyId);
  expect(mockUserRepository.get).toHaveBeenCalledWith(id, { profile: ['fullName'] });
  expect(res).toEqual([]);
});
