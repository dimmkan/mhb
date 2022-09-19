module.exports = async function userPointsUseCase(
  { loyaltyManager },
) {
  const { admin, adminInvitation } = loyaltyManager.types;
  return {
    operations: Object.values(admin),
    invitations: Object.values(adminInvitation),
  };
};
