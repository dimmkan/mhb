module.exports = async (
  { cmsExternal },
  { userId },
) => cmsExternal.getUserPassport({ userId });
