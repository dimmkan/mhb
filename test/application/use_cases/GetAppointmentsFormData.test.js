const getFormData = require('application/use_cases/appointments/getFormData');

test('get appointments form data', async () => {
  const response = {
    manager: 'managerName',
    themes: [],
    schedule: [],
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

  const mockUppOrnExternal = {};
  mockUppOrnExternal.setUrl = jest.fn(() => undefined);
  mockUppOrnExternal.getThemes = jest.fn(() => (
    {
      success: true,
      data: {
        Themes: [],
      },
    }
  ));
  mockUppOrnExternal.getManager = jest.fn(() => (
    {
      success: true,
      data: {
        name: 'managerName',
      },
    }
  ));
  mockUppOrnExternal.getScheduleOfAppointments = jest.fn(() => (
    {
      success: true,
      data: {
        Schedule: [],
      },
    }
  ));

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
  const res = await getFormData(
    mockServiceLocator,
    id,
    residentId,
  );

  // then
  expect(mockUppOrnExternal.setUrl).toHaveBeenCalledWith(managingCompany.url);
  expect(mockUppOrnExternal.getManager).toHaveBeenCalledWith(managingCompany.code);
  expect(mockUppOrnExternal.getThemes).toHaveBeenCalledWith();
  expect(mockUppOrnExternal.getScheduleOfAppointments).toHaveBeenCalledWith(managingCompany.code);
  expect(mockResidentProfileRepository.findByResidentIdAndUserId)
    .toHaveBeenCalledWith(residentId, id);
  expect(mockCmsExternal.getManagingCompanyById)
    .toHaveBeenCalledWith(resident.residentAccount.managingCompanyId);
  expect(res).toEqual(response);
});
