/* eslint linebreak-style: ["error", "windows"] */

const getCategories = require('application/use_cases/eds/getCategories');

test('get EDS request list', async () => {
  const list = [];

  const mockEdsExternal = {};
  mockEdsExternal.getCategories = jest.fn(() => list);

  const mockServiceLocator = {
    edsExternal: mockEdsExternal,
  };

  // when
  const res = await getCategories(
    mockServiceLocator,
  );

  // then
  expect(mockEdsExternal.getCategories).toHaveBeenCalledWith();
  expect(res).toEqual(list);
});
