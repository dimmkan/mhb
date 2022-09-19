module.exports = async function getPayments(
  { residentProfileRepository, nedolzhnikExternal },
  { id },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getPayments(residentId);
};
