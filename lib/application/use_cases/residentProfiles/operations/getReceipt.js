module.exports = async function getReceipt(
  { residentProfileRepository, nedolzhnikExternal },
  { id, date },
) {
  const { residentId } = await residentProfileRepository.get(id);
  return nedolzhnikExternal.getReceipt(residentId, { date });
};
