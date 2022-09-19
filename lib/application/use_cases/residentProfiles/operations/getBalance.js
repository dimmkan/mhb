module.exports = async function getBalance(
  { residentProfileRepository, nedolzhnikExternal },
  { id },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getBalance(residentId);
};
