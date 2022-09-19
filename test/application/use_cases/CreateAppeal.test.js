const createAppeal = require('application/use_cases/appeals/createAppeal');

test('create appeal', async () => {
  const response = {
    success: true,
    data: {},
  };
  const id = 7;
  const requestBody = {
    residentId: {
      value: '86944365',
    },
    themeId: {
      value: '123-312',
    },
    content: {
      value: 'example',
    },
    answerInPaperForm: {
      value: 'true',
    },
    files: {
      path: '/123.jpg',
      name: '123.jpg',
    },
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

  const uploadResponse = {
    Key: '/appeals/123.jpg',
    Location: 'https://storage.yandexcloud.net/appeals/123.jpg',
  };

  const request = {
    personalAccount: String(requestBody.residentId.value),
    idUser: String(id),
    themeId: requestBody.themeId.value,
    username: user.profile.fullName,
    phonenumber: user.phone,
    email: user.email,
    address: resident.residentAccount.address.result,
    organizationCode: managingCompany.code,
    content: requestBody.content.value || '',
    answerInPaperForm: true,
    files: [{ link: '/appeals/123.jpg', name: '123.jpg' }],
  };

  const mockUppOrnExternal = {};
  mockUppOrnExternal.setUrl = jest.fn(() => undefined);
  mockUppOrnExternal.createAppeal = jest.fn(() => response);

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findByResidentIdAndUserId = jest.fn(() => resident);

  const mockCmsExternal = {};
  mockCmsExternal.getManagingCompanyById = jest.fn(() => managingCompany);

  const mockUserRepository = {};
  mockUserRepository.get = jest.fn(() => user);

  const mockYandexS3External = {};
  mockYandexS3External.upload = jest.fn(() => uploadResponse);
  mockYandexS3External.remove = jest.fn(() => undefined);

  const mockServiceLocator = {
    uppOrnExternal: mockUppOrnExternal,
    residentProfileRepository: mockResidentProfileRepository,
    cmsExternal: mockCmsExternal,
    userRepository: mockUserRepository,
    yandexS3External: mockYandexS3External,
  };

  // when
  const res = await createAppeal(
    mockServiceLocator,
    id,
    requestBody,
  );

  // then
  expect(mockUppOrnExternal.setUrl).toHaveBeenCalledWith(managingCompany.url);
  expect(mockYandexS3External.upload).toHaveBeenCalledWith({
    path: '/123.jpg',
    name: expect.anything(),
  }, '/appeals/');
  expect(mockUppOrnExternal.createAppeal).toHaveBeenCalledWith(request);
  expect(mockResidentProfileRepository.findByResidentIdAndUserId)
    .toHaveBeenCalledWith(requestBody.residentId.value, id);
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
