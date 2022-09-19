const addProfile = async ({ edsProfileRepository }, profileData) => {
  await edsProfileRepository.upsert(profileData);
  return { success: true };
};

module.exports = addProfile;
