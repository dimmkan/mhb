/* eslint linebreak-style: ["error", "windows"] */

const getRequestList = require('application/use_cases/eds/getRequestList');

test('get EDS request list', async () => {
  // given
  const id = 39;
  const profileId = 9100;
  const page = 1;
  const limit = 2;

  const result = {
    data: [
      {
        id: '677869',
        user_id: '9100',
        topic_id: '5',
        topic_name: 'Засор в раковине',
        status: 'На модерации',
        firstname: 'Петр',
        lastname: 'Иванов',
        secondname: 'Сергеевич',
        email: 'sdf@ma.ru',
        phone: '79789989990',
        created: '06.02.2022 18:51:09',
        description: 'Подключить домофон',
        city: 'Балашиха',
        district: 'Юбилейный мкр',
        street: 'Советская ул',
        building: '2',
        house: '5',
        podezd: '1',
        kvart: '42',
        photo: '',
        photos: '',
        performer: '',
        create_on_site: '1',
        subject: '',
        reason: '',
        delayed_date: '15.02.2022',
        closed_date: '',
        report_photos: '',
        user_confirm: null,
      },
      {
        id: '677868',
        user_id: '9100',
        topic_id: '5',
        topic_name: 'Засор в раковине',
        status: 'На модерации',
        firstname: 'Петр',
        lastname: 'Иванов',
        secondname: 'Сергеевич',
        email: 'sdf@ma.ru',
        phone: '79789989990',
        created: '06.02.2022 18:50:06',
        description: 'Подключить домофон',
        city: 'Балашиха',
        district: 'Юбилейный мкр',
        street: 'Советская ул',
        building: '2',
        house: '5',
        podezd: '1',
        kvart: '42',
        photo: '',
        photos: '',
        performer: '',
        create_on_site: '1',
        subject: '',
        reason: '',
        delayed_date: '15.02.2022',
        closed_date: '',
        report_photos: '',
        user_confirm: null,
      },
    ],
  };

  const list = {
    0:
      {
        id: '677869',
        user_id: '9100',
        topic_id: '5',
        topic_name: 'Засор в раковине',
        status: 'На модерации',
        firstname: 'Петр',
        lastname: 'Иванов',
        secondname: 'Сергеевич',
        email: 'sdf@ma.ru',
        phone: '79789989990',
        created: '06.02.2022 18:51:09',
        description: 'Подключить домофон',
        city: 'Балашиха',
        district: 'Юбилейный мкр',
        street: 'Советская ул',
        building: '2',
        house: '5',
        podezd: '1',
        kvart: '42',
        photo: '',
        photos: '',
        performer: '',
        create_on_site: '1',
        subject: '',
        reason: '',
        delayed_date: '15.02.2022',
        closed_date: '',
        report_photos: '',
        user_confirm: null,
      },
    1: {
      id: '677868',
      user_id: '9100',
      topic_id: '5',
      topic_name: 'Засор в раковине',
      status: 'На модерации',
      firstname: 'Петр',
      lastname: 'Иванов',
      secondname: 'Сергеевич',
      email: 'sdf@ma.ru',
      phone: '79789989990',
      created: '06.02.2022 18:50:06',
      description: 'Подключить домофон',
      city: 'Балашиха',
      district: 'Юбилейный мкр',
      street: 'Советская ул',
      building: '2',
      house: '5',
      podezd: '1',
      kvart: '42',
      photo: '',
      photos: '',
      performer: '',
      create_on_site: '1',
      subject: '',
      reason: '',
      delayed_date: '15.02.2022',
      closed_date: '',
      report_photos: '',
      user_confirm: null,
    },
  };

  const mockEdsProfileRepository = {};
  mockEdsProfileRepository.getByUserId = jest.fn(() => ({ edsId: profileId }));

  const mockEdsExternal = {};
  mockEdsExternal.getRequestList = jest.fn(() => list);

  const mockServiceLocator = {
    edsExternal: mockEdsExternal,
    edsProfileRepository: mockEdsProfileRepository,
  };

  // when
  const res = await getRequestList(
    mockServiceLocator,
    {
      id, page, limit,
    },
  );

  // then
  expect(mockEdsProfileRepository.getByUserId).toHaveBeenCalledWith(id);
  expect(mockEdsExternal.getRequestList).toHaveBeenCalledWith({
    profileId,
    page,
    nPageSize: limit,
  });
  expect(res).toEqual(result);
});
