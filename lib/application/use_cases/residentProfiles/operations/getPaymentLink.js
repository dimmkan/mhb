module.exports = async function getPaymentLink(
  { residentProfileRepository, userRepository, nedolzhnikExternal },
  { id, amount, type },
) {
  const { residentId, userId } = await residentProfileRepository.get(id);
  const { phone, email } = await userRepository.get(userId);
  return nedolzhnikExternal.getPaymentLink(residentId, {
    amount, phone, email, type,
  });
};
