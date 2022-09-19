const { AppError, errorCodes } = require('shared/errors');

/** Получаем город по координатам с помощью dadataExternal
 *  Params:
 *      dadataExternal - сервис работы с dadata.ru
 *      cmsExternal - сервис админки
 *      lat - широта
 *      lon - долгота
 *  Response: {
 *              id: 'city id',
 *              title: 'city name'
 *            }
 *  Сервис dadataExternal может вернуть пустой массив suggestions, если не
 *  найдет ни одного города по заданным координатам, в таком случае - бросаем ошибку
 *
 *  Также, город может быть не тем, что мы обслуживаем (данные получаем из админки).
 *  В таком случае также кидаем 404 - City not found.
 * */
async function getCityByCoordinate({ dadataExternal, cmsExternal }, { lat, lon }) {
  try {
    const { city } = await dadataExternal.reverseGeocoding(lat, lon);
    const data = await cmsExternal.getCityByTitle(city);
    return data;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
}

module.exports = getCityByCoordinate;
