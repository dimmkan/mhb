module.exports = async (
  { cmsExternal },
  { userId },
) => cmsExternal.deleteUserAvatar({ userId });
