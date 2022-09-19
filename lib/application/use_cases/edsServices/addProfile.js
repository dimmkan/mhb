const addProfile = async ({ edsServicesProfileRepository }, profileData) => {
  await edsServicesProfileRepository.upsert(profileData);
  return { success: true };
};

module.exports = addProfile;
