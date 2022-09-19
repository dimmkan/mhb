const { AppError, errorCodes } = require('shared/errors');

module.exports = async function deleteResidentProfile(
  { residentProfileRepository },
  { id },
) {
  const childrens = await residentProfileRepository.findChildrens(id);
  if (!childrens.length) return residentProfileRepository.remove(id);
  throw new AppError(errorCodes.HAS_SECOND_USER);
};
