module.exports = async (
  dependencies,
  data,
) => {
  const { cmsExternal, loyaltyManager } = dependencies;
  await cmsExternal.upsertUserPassport(data);
  await loyaltyManager.onceDebit(dependencies, {
    userId: data.userId,
    ...loyaltyManager.types.user.PASSPORT_VERIFICATION,
    fingerprint: `${data.userId}`,
  });
};
