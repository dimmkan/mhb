module.exports = async function getMeashures(
  { residentProfileRepository, nedolzhnikExternal },
  { id },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getMeashures(residentId);
};
