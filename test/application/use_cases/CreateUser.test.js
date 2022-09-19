const CreateUser = require('application/use_cases/user/createUser');

test('persist user', async () => {
  // given
  const phone = '+70000000000';
  const email = 'test@mail.net';
  const password = 'password';
  const fullName = 'fullname fio';

  const persistedUser = {
    phone,
    password,
    email,
    phoneConfirmed: true,
    emailConfirmed: false,
    confirmed: true,
    profile: {
      fullName,
      confirmed: false,
      sex: null,
      birthday: null,
    },
  };

  const mockHashManager = {};
  mockHashManager.hash = jest.fn(() => password);

  const mockUserRepository = {};
  mockUserRepository.persist = jest.fn(() => persistedUser);

  // when
  const user = await CreateUser(
    {
      userRepository: mockUserRepository,
      hashManager: mockHashManager,
    },
    {
      phone, email, password, fullName,
    },
  );

  // then
  expect(mockUserRepository.persist).toHaveBeenCalledWith({
    phone,
    email,
    password,
    profile: { fullName },
    phoneConfirmed: true,
    confirmed: true,
  });
  expect(mockHashManager.hash).toHaveBeenCalledWith(password);
  expect(user).toEqual(persistedUser);
});
