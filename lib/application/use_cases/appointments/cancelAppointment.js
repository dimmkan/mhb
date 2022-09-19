const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const cancelAppointment = async (
  { uppOrnExternal, residentProfileRepository, cmsExternal },
  userId,
  requestBody,
) => {
  const {
    residentId,
    id,
  } = requestBody;

  const resident = await residentProfileRepository.findByResidentIdAndUserId(residentId, userId);

  if (!_.path(['residentAccount', 'managingCompanyId'], resident)) {
    throw new AppError(errorCodes.SERVER);
  }

  const managingCompany = await cmsExternal.getManagingCompanyById(
    resident.residentAccount.managingCompanyId,
  );

  if (!_.prop('url', managingCompany)) throw new AppError(errorCodes.EXTERNAL);

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.cancelAppointment(id);

  if (!_.prop('success', response)) throw new AppError(errorCodes.EXTERNAL);
};

module.exports = cancelAppointment;
