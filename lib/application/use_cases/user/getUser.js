const getUser = async ({
  userRepository,
  residentProfileRepository,
  cmsExternal,
  edsProfileRepository,
  edsServicesProfileRepository,
}, userId) => {
  const [
    user,
    residentProfiles,
    avatar,
    edsProfile,
    edsServicesProfile,
  ] = await Promise.all([
    userRepository.get(userId, {
      user: ['phone', 'phoneConfirmed', 'email', 'emailConfirmed', 'confirmed'],
      profile: ['confirmed', 'fullName', 'birthday', 'sex'],
    }),
    residentProfileRepository.findAllByUserIdWithAddress(userId),
    cmsExternal.getUserAvatar({ userId }),
    edsProfileRepository.getByUserId(userId).catch(() => null),
    edsServicesProfileRepository.getByUserId(userId).catch(() => null),
  ]);

  return {
    user,
    residentProfiles,
    avatar,
    edsProfile,
    edsServicesProfile,
  };
};

module.exports = getUser;
