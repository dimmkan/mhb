/* eslint linebreak-style: ["error", "windows"] */

const getListNotifications = require('application/use_cases/notifications/getListNotifications');

test('get list notifications', async () => {
  // given
  const id = 39;
  const page = 1;
  const limit = 2;

  const list = [
    {
      id: 44,
      isRead: false,
      type: 'DELETE_USER_NOTIFICATION',
      userId: 39,
      notificationId: 55,
      createdAt: '2022-03-17T10:10:16.294Z',
      updatedAt: '2022-03-17T10:10:16.294Z',
      notification: {
        id: 55,
        title: 'Удаление лицевого счета',
        body: 'Ваш аккаунт был откреплен от Л/С 86944365 главным пользователем',
        payload: {
          type: 'DELETE_USER_NOTIFICATION',
          userId: 39,
          residentProfileId: 42,
        },
        createdAt: '2022-03-17T10:10:16.292Z',
        updatedAt: '2022-03-17T10:10:16.292Z',
      },
    },
    {
      id: 42,
      isRead: false,
      type: 'DELETE_USER_NOTIFICATION',
      userId: 39,
      notificationId: 53,
      createdAt: '2022-03-17T10:09:27.887Z',
      updatedAt: '2022-03-17T10:09:27.887Z',
      notification: {
        id: 53,
        title: 'Удаление лицевого счета',
        body: 'Ваш аккаунт был откреплен от Л/С 86944365 главным пользователем',
        payload: {
          type: 'DELETE_USER_NOTIFICATION',
          userId: 39,
          residentProfileId: 41,
        },
        createdAt: '2022-03-17T10:09:27.882Z',
        updatedAt: '2022-03-17T10:09:27.882Z',
      },
    },
  ];

  const result = {
    data: list,
    metadata: {
      pages: 1,
      count: 2,
    },
  };

  const mockUserNotificationsRepository = {};
  mockUserNotificationsRepository.getByUserId = jest.fn(() => list);
  mockUserNotificationsRepository.getCountByUserId = jest.fn(() => ({ count: '2' }));

  const mockServiceLocator = {
    userNotificationsRepository: mockUserNotificationsRepository,
  };

  // when
  const res = await getListNotifications(
    mockServiceLocator,
    {
      id, page, limit,
    },
  );

  // then
  expect(mockUserNotificationsRepository.getCountByUserId).toHaveBeenCalledWith(id);
  expect(mockUserNotificationsRepository.getByUserId).toHaveBeenCalledWith({
    id, page, limit,
  });
  expect(res).toEqual(result);
});
