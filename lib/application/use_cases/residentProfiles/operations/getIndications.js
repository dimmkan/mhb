module.exports = async function getIndications(
  { residentProfileRepository, nedolzhnikExternal },
  { id },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getIndications(residentId);
};
