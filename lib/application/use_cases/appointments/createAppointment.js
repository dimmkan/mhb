const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const createAppointment = async (
  {
    uppOrnExternal, residentProfileRepository, cmsExternal, userRepository,
  },
  userId,
  requestBody,
) => {
  const {
    residentId,
    themeId,
    date,
    time,
    content,
  } = requestBody;

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

  if (!_.prop('code', managingCompany) || !_.prop('url', managingCompany)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  const user = await userRepository.get(userId, {
    user: ['phone', 'email'],
    profile: ['fullName'],
  });

  if (!_.prop('phone', user) || !_.path(['profile', 'fullName'], user)) throw new AppError(errorCodes.SERVER);

  const { address } = resident.residentAccount;

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.createAppointment({
    personalAccount: String(residentId),
    idUser: String(userId),
    themeId,
    username: user.profile.fullName.toUpperCase(),
    phonenumber: user.phone,
    email: user.email,
    appointmentDate: date,
    appointmentTime: time,
    address: address.result ? address.result : address.source,
    organizationCode: managingCompany.code,
    content,
  });

  if (_.prop('message', response) === 'Выбранная дата занята.') throw new AppError(errorCodes.IS_BUSY);
  if (_.prop('message', response) === 'Нет доступных записей на выбранную дату') {
    throw new AppError(errorCodes.NO_APPOINTMENTS_ON_THIS_DATE);
  }
  if (!_.prop('success', response)) throw new AppError(errorCodes.EXTERNAL);

  return response.data;
};

module.exports = createAppointment;
