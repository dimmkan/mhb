const createAppointment = require('application/use_cases/appointments/createAppointment');

test('create appeal', async () => {
  const response = {
    success: true,
    data: {},
  };
  const id = 7;
  const requestBody = {
    residentId: '86944365',
    themeId: '123-312',
    date: '2022-03-29',
    time: '10:00',
    content: 'example',
  };
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
    phone: '+79999999999',
    email: 'test@test.ru',
    profile: {
      fullName: 'IVAN',
    },
  };

  const request = {
    personalAccount: String(requestBody.residentId),
    idUser: String(id),
    themeId: requestBody.themeId,
    username: user.profile.fullName,
    phonenumber: user.phone,
    email: user.email,
    appointmentDate: requestBody.date,
    appointmentTime: requestBody.time,
    address: resident.residentAccount.address.result,
    organizationCode: managingCompany.code,
    content: requestBody.content || '',
  };

  const mockUppOrnExternal = {};
  mockUppOrnExternal.setUrl = jest.fn(() => undefined);
  mockUppOrnExternal.createAppointment = jest.fn(() => response);

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
  const res = await createAppointment(
    mockServiceLocator,
    id,
    requestBody,
  );

  // then
  expect(mockUppOrnExternal.setUrl).toHaveBeenCalledWith(managingCompany.url);
  expect(mockUppOrnExternal.createAppointment).toHaveBeenCalledWith(request);
  expect(mockResidentProfileRepository.findByResidentIdAndUserId)
    .toHaveBeenCalledWith(requestBody.residentId, id);
  expect(mockCmsExternal.getManagingCompanyById)
    .toHaveBeenCalledWith(resident.residentAccount.managingCompanyId);
  expect(mockUserRepository.get).toHaveBeenCalledWith(
    id,
    {
      user: ['phone', 'email'],
      profile: ['fullName'],
    },
  );
  expect(res).toEqual({});
});
