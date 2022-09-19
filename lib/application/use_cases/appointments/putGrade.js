const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const putGrade = async (
  dependencies,
  userId,
  requestBody,
  gradeType,
) => {
  const {
    id,
    grade,
    message,
    residentId,
  } = requestBody;
  const {
    uppOrnExternal,
    residentProfileRepository,
    cmsExternal,
    loyaltyManager,
  } = dependencies;

  const resident = await residentProfileRepository.findByResidentIdAndUserId(
    residentId,
    userId,
  );

  if (!_.path(['residentAccount', 'managingCompanyId'], resident)) {
    throw new AppError(errorCodes.SERVER);
  }

  const managingCompany = await cmsExternal.getManagingCompanyById(
    resident.residentAccount.managingCompanyId,
  );

  if (!_.prop('url', managingCompany)) throw new AppError(errorCodes.EXTERNAL);

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.putGrade(id, grade, message || '');

  if (!_.prop('success', response)) throw new AppError(errorCodes.EXTERNAL);

  const loaltyType = gradeType === 'appeals' ? loyaltyManager.types.user.APPEALS_REVIEW : loyaltyManager.types.user.PERCONAL_RECEPTION_REVIEW;

  await loyaltyManager.onceDebit(dependencies, {
    ...loaltyType,
    userId,
    source: 'main',
    sourceId: id,
    fingerprint: `${userId}:${id}`,
  });
};

module.exports = putGrade;
