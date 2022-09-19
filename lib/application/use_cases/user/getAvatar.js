module.exports = async (
  { cmsExternal },
  { userId },
) => cmsExternal.getUserAvatar({ userId });
