const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const isNearbySaturday = (date) => {
  const dateOfAppointment = new Date(date.date);
  const currentDate = new Date();
  const differenceInDays = (dateOfAppointment - currentDate) / (1000 * 3600 * 24);

  return dateOfAppointment.getDay() === 6 && differenceInDays < 7;
};

const isSaturday = (date) => new Date(date.date).getDay() === 6;

const getFormData = async (
  { uppOrnExternal, residentProfileRepository, cmsExternal },
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

  const managerResponse = await uppOrnExternal.getManager(managingCompany.code);
  if (!_.path(['data', 'name'], managerResponse) || !_.prop('success', managerResponse)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  const themesResponse = await uppOrnExternal.getThemes();
  if (!_.path(['data', 'Themes'], themesResponse) || !_.prop('success', themesResponse)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  const scheduleResponse = await uppOrnExternal.getScheduleOfAppointments(
    managingCompany.code,
  );
  if (!_.hasPath(['data', 'Schedule'], scheduleResponse) || !_.prop('success', scheduleResponse)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  const schedule = _.path(['data', 'Schedule'], scheduleResponse);

  const allSaturdaysHours = _.filter(isSaturday, schedule);
  const nearbySaturdayHours = _.filter(isNearbySaturday, allSaturdaysHours);
  const saturdaysHours = _.difference(allSaturdaysHours, nearbySaturdayHours);
  const saturdaysHoursToShow = saturdaysHours.length ? saturdaysHours : nearbySaturdayHours;

  const hours = _.difference(schedule, allSaturdaysHours);

  return {
    manager: _.path(['data', 'name'], managerResponse),
    themes: _.path(['data', 'Themes'], themesResponse),
    schedule: hours.length ? hours : saturdaysHoursToShow,
  };
};

module.exports = getFormData;
