const putGradeWebhook = require('application/use_cases/appointments/putGradeWebhook');
const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');

test('put grade appointment/appeal webhook', async () => {
  const response = {
    success: true,
  };
  const requestBody = {
    residentId: '86944365',
    id: '1212-21212-212',
    idUser: '7',
    status: '1',
    type: '0',
    theme: 'themeName',
    date: '2022-03-29',
  };
  const sendData = {
    userId: requestBody.idUser,
    type: notificationEnum.RATE_QUALITY_NOTIFICATION,
    theme: requestBody.theme,
    date: '29 марта 2022',
  };

  const mockPushManager = {};
  mockPushManager.sendToUser = jest.fn(() => response);

  const mockServiceLocator = {
    pushManager: mockPushManager,
  };

  // when
  const res = await putGradeWebhook(
    mockServiceLocator,
    requestBody,
  );

  // then
  expect(mockPushManager.sendToUser).toHaveBeenCalledWith(
    mockServiceLocator,
    sendData,
  );
  expect(res).toEqual(response);
});
