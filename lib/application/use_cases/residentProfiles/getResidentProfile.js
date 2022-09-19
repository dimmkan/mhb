module.exports = function getResidentProfiles(
  { residentProfileRepository },
  id,
) {
  return residentProfileRepository.get(id);
};
