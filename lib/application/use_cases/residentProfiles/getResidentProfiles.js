module.exports = function getResidentProfiles(
  { residentProfileRepository },
  { userId },
) {
  return residentProfileRepository.findAllByUserIdWithAddress(userId);
};
