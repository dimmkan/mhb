const { AppError, errorCodes } = require('shared/errors');

async function getPeriodList(serviceLocator, residentProfileId) {
  const {
    residentProfileRepository,
    cmsExternal,
    reformaZhkhExternal,
  } = serviceLocator;
  const profileData = await residentProfileRepository.get(residentProfileId, {
    fields: {
      residentAccount: ['*'],
    },
  });

  const { login, password } = await cmsExternal
    .getZhkhInfoByManagingCompanyId(profileData.residentAccount.managingCompanyId);

  if (!login || !password) throw new AppError(errorCodes.NOT_FOUND, { descriptionRu: 'Данные о доме в системе отсутствуют', message: 'Данные для авторизации не найдены' });

  try {
    const periodList = await reformaZhkhExternal.getReportingPeriodList({ login, password });
    return periodList;
  } catch (e) {
    throw new AppError(errorCodes.BAD_REQUEST, { descriptionRu: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.', message: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.' });
  }
}

module.exports = getPeriodList;
