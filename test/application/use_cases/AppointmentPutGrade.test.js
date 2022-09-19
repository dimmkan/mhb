const putGrade = require('application/use_cases/appointments/putGrade');

test('put grade appointment/appeal', async () => {
  const response = {
    success: true,
  };
  const id = 7;
  const requestBody = {
    residentId: '86944365',
    id: '1212-21212-212',
    grade: 5,
    message: 'comment',
  };
  const resident = [
    {
      residentAccount: {
        managingCompanyId: 1,
      },
    },
  ];

  const managingCompany = {
    url: 'test',
    code: 'ЖС',
  };

  const mockUppOrnExternal = {};
  mockUppOrnExternal.setUrl = jest.fn(() => undefined);
  mockUppOrnExternal.putGrade = jest.fn(() => response);

  const mockResidentProfileRepository = {};
  mockResidentProfileRepository.findByResidentIdAndUserId = jest.fn(() => resident);

  const mockCmsExternal = {};
  mockCmsExternal.getManagingCompanyById = jest.fn(() => managingCompany);

  const mockServiceLocator = {
    uppOrnExternal: mockUppOrnExternal,
    residentProfileRepository: mockResidentProfileRepository,
    cmsExternal: mockCmsExternal,
  };

  // when
  const res = await putGrade(
    mockServiceLocator,
    id,
    requestBody,
  );

  // then
  expect(mockUppOrnExternal.setUrl).toHaveBeenCalledWith(managingCompany.url);
  expect(mockUppOrnExternal.putGrade).toHaveBeenCalledWith(
    requestBody.id,
    requestBody.grade,
    requestBody.message,
  );
  expect(mockResidentProfileRepository.findByResidentIdAndUserId)
    .toHaveBeenCalledWith(requestBody.residentId, id);
  expect(mockCmsExternal.getManagingCompanyById)
    .toHaveBeenCalledWith(resident.residentAccount.managingCompanyId);
  expect(res).toEqual(undefined);
});
