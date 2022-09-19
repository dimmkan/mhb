const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const getAppointments = async (
  {
    uppOrnExternal, residentProfileRepository, cmsExternal, userRepository,
  },
  userId,
  residentId,
) => {
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

  const user = await userRepository.get(userId, {
    profile: ['fullName'],
  });

  if (!_.path(['profile', 'fullName'], user)) throw new AppError(errorCodes.SERVER);

  const { address } = resident.residentAccount;

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.getAppointments(
    residentId,
    user.profile.fullName.toUpperCase(),
    address.result ? address.result : address.source,
  );

  if (!_.hasPath(['data', 'Appointments'], response) || !_.prop('success', response)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  return response.data.Appointments;
};

module.exports = getAppointments;
