module.exports = function getUsers({ residentProfileRepository }, { userId }) {
  return residentProfileRepository.findChildrensProfilesByUserId(userId)
    .then((residentProfiles) => (
      residentProfiles.map(({ residentId, children }) => children.map(({ id, user }) => ({
        residentId,
        id,
        phone: user.phone,
        fullName: user.profile.fullName,
      })))
    ))
    .then((x) => (x || []).flat(1));
};
