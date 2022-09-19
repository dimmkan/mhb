const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const getFormData = async (
  { residentProfileRepository, cmsExternal, uppOrnExternal },
  userId,
  residentId,
) => {
  const resident = await residentProfileRepository.findByResidentIdAndUserId(residentId, userId);

  if (!_.path(['residentAccount', 'managingCompanyId'], resident)) {
    throw new AppError(errorCodes.SERVER);
  }

  const managingCompany = await cmsExternal.getManagingCompanyById(
    resident.residentAccount.managingCompanyId,
  );

  if (!_.prop('code', managingCompany) || !_.prop('url', managingCompany)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.getThemes();

  if (!_.prop('success', response) || !_.path(['data', 'Themes'], response)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  return _.path(['data', 'Themes'], response);
};

module.exports = getFormData;
