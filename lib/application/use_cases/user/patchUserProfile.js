const createUser = async (
  { userRepository },
  {
    userId, data,
  },
) => userRepository.mergeProfile({ userId, ...data });

module.exports = createUser;
