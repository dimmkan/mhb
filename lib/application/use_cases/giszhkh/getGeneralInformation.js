const first = require('shared/utils/helper/first');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

async function getGeneralInformation(serviceLocator, residentProfileId) {
  const {
    residentProfileRepository,
    cmsExternal,
    reformaZhkhExternal,
    dadataExternal,
  } = serviceLocator;

  const profileData = await residentProfileRepository.get(residentProfileId, {
    fields: {
      'residentAccount.address': ['*'],
    },
  });

  const dadataAddress = await dadataExternal.findById({ query: _.path(['residentAccount', 'address', 'fiasId'], profileData) });
  const houseFiasId = _.path(['house_fias_id'], dadataAddress);
  const { login, password, inn } = await cmsExternal
    .getZhkhInfoByManagingCompanyId(profileData.residentAccount.managingCompanyId);

  if (!login || !password) throw new AppError(errorCodes.NOT_FOUND, { descriptionRu: 'Данные о доме в системе отсутствуют', message: 'Данные для авторизации не найдены' });

  try {
    const periodList = await reformaZhkhExternal.getReportingPeriodList({ login, password });
    const currentPeriod = periodList.find((item) => item.state === '1');
    const houseList = await reformaZhkhExternal.getHouseList({ login, password }, inn);
    const currentHouse = first(houseList.filter((item) => item.houseguid === houseFiasId));
    const houseProfile = await reformaZhkhExternal
      .getHouseProfile({ login, password }, {
        reporting_period_id: currentPeriod.id,
        house_id: currentHouse.house_id,
      });

    return houseProfile;
  } catch (e) {
    throw new AppError(errorCodes.BAD_REQUEST, { descriptionRu: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.', message: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.' });
  }
}

module.exports = getGeneralInformation;
