/* eslint linebreak-style: ["error", "windows"] */

const addRequest = require('application/use_cases/eds/addRequest');

test('create new EDS request', async () => {
  // given
  const id = '34';
  const profileId = '9103';

  const result = {
    id: '677904',
    user_id: '9103',
    topic_id: '3',
    status: 'На модерации',
    firstname: 'Дмитрий',
    lastname: 'Васильевич',
    secondname: 'Канаев',
    email: 'sdf@ma.ru',
    phone: '79304095717',
    created: '29.03.2022 16:38:39',
    description: 'По мне что-то бегает когда я сплю 11!!',
    city: 'Королёв',
    district: '',
    street: '20-летия Октября ул',
    building: '',
    house: '101',
    podezd: '3',
    kvart: '52',
    foto1: '625130_1648561119.png',
    performer: '',
    create_on_site: '1',
    subject: '',
    reason: '',
    delayed_date: '31.03.2022',
    closed_date: '',
    report_photos: '',
    user_confirm: '0',
    foto2: '641345_1648561119.png',
    foto3: '364791_1648561119.png',
    foto4: '373871_1648561119.png',
    foto5: '966111_1648561119.png',
    foto6: '958643_1648561119.png',
    foto7: '265320_1648561119.png',
    foto8: '521946_1648561119.png',
    foto9: '609399_1648561119.png',
    foto10: '110890_1648561119.png',
  };

  const mockEdsProfileRepository = {};
  mockEdsProfileRepository.getByUserId = jest.fn(() => ({ edsId: profileId }));

  const mockEdsExternal = {};
  mockEdsExternal.createRequest = jest.fn(() => result);

  const mockServiceLocator = {
    edsExternal: mockEdsExternal,
    edsProfileRepository: mockEdsProfileRepository,
  };

  // when
  const res = await addRequest(
    mockServiceLocator,
    {
      userId: id, ...result,
    },
  );

  // then
  expect(mockEdsProfileRepository.getByUserId).toHaveBeenCalledWith(id);
  expect(mockEdsExternal.createRequest).toHaveBeenCalledWith(
    {
      ...result,
      user_id: profileId,
      userId: id,
    },
  );
  expect(res).toEqual(result);
});
