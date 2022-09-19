const vacancyResponse = require('application/use_cases/vacancies/vacancyResponse');

test('vacancy response', async () => {
  const vacancyId = 1;
  const vacancy = {
    id: 1,
    position: 'Электрик',
    hr_manager: {
      name: 'Иванов Иван Иванович',
      phone: '+7 (999) 8887766',
      email: 'test@example.com',
    },
  };
  const requestBody = {
    name: 'Федоров Федор Федорович',
    city: 'Реутов',
    phone: '+7 (999) 8887765',
    email: 'test1@example.com',
    birthday: '1990-09-28',
    sex: 'male',
    experience: true,
    files: {
      path: '/123.jpg',
      name: '123.jpg',
    },
  };

  const mockCmsExternal = {};
  mockCmsExternal.getVacancyById = jest.fn(() => vacancy);

  const mockEmailExternal = {};
  mockEmailExternal.send = jest.fn(() => {});

  const mockServiceLocator = {
    cmsExternal: mockCmsExternal,
    emailExternal: mockEmailExternal,
  };

  // when
  const res = await vacancyResponse(
    mockServiceLocator,
    vacancyId,
    requestBody,
  );

  // then
  expect(mockCmsExternal.getVacancyById)
    .toHaveBeenCalledWith(vacancyId);
  expect(mockEmailExternal.send)
    .toHaveBeenCalledWith(
      vacancy.hr_manager.email,
      '<h1>Вакансия: Электрик</h1><i><b>Ф.И.О.</b>: Федоров Федор Федорович</i><br><br><i>'
      + '<b>Город</b>: Реутов</i><br><br><i><b>Телефон</b>: +7 (999) 8887765</i><br><br><i>'
      + '<b>E-mail</b>: test1@example.com</i><br><br><i><b>Дата рождения</b>: 1990-09-28</i>'
      + '<br><br><i><b>Пол</b>: Мужской</i><br><br><i><b>Опыт работы</b>: Да</i><br><br>',
      'Отклик на вакансию',
      [requestBody.files],
    );
  expect(res).toEqual(undefined);
});
