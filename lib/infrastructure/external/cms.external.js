const _ = require('ramda');
const { Directus } = require('@directus/sdk');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const env = require('infrastructure/config/env');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const throwIs = require('shared/utils/helper/throwIs');
const { AppError, errorCodes } = require('shared/errors');

const cmsExternal = () => {
  const directus = new Directus(env.CMS_EXT_PUBLIC_URL, {
    auth: { staticToken: env.CMS_EXT_TOKEN },
  });

  const userPassportCollection = directus.items('user_passport');
  const userAvatarCollection = directus.items('user_avatar');
  const cityCollection = directus.items('city');
  const managementCollection = directus.items('management');
  const edsRegisterFault = directus.items('eds_register_fault');
  const edsServiceRegisterFault = directus.items('eds_service_register_fault');
  const pollsCollection = directus.items('polls');
  const residentIndicationsCollection = directus.items('resident_indications');
  const vacanciesCollection = directus.items('vacancies');
  const edsProfileAddCollection = directus.items('eds_profile_add');
  const edsServicesProfileAddCollection = directus.items('eds_services_profile_add');

  const directusLegacy = axios.create({
    baseURL: env.CMS_EXT_PUBLIC_URL,
    timeout: 60000,
    headers: { Authorization: `Bearer ${env.CMS_EXT_TOKEN}` },
  });
  directusLegacy.interceptors.response.use(
    _.prop('data'),
    _.converge(
      (status, code) => { throw new AppError(errorCodes.EXTERNAL, { status, code }); },
      [
        _.path(['response', 'status']),
        _.path(['response', 'data', 'errors', 0, 'extensions', 'code']),
      ],
    ),
  );

  const uploadFiles = (files) => {
    if (isEmptyOrNull(files)) throw new Error('Empty files');

    const form = new FormData();
    [files].flat(1).forEach((part) => {
      form.append(
        'file',
        fs.createReadStream(part.path),
        _.pick(['mimetype', 'filename', 'encoding'], part),
      );
    });

    return directusLegacy({
      method: 'post',
      url: '/files',
      data: form,
      headers: form.getHeaders(),
      params: { fields: 'id' },
    }).then(_.prop('data'));
  };

  const upsertUserPassport = async ({ file, ...data }) => {
    const imageObject = file && await uploadFiles(file).then(({ id }) => ({ image: id }));
    const storeObject = { ...imageObject, ...data };
    return userPassportCollection
      .readByQuery({ filter: { userId: data.userId }, fields: 'id' })
      .then(_.path(['data', 0]))
      .then((item) => (
        item
          ? userPassportCollection.updateOne(item.id, storeObject)
          : userPassportCollection.createOne(storeObject)
      ));
  };

  const upsertUserAvatar = async ({ userId, file }) => {
    const image = await uploadFiles(file).then(({ id }) => id);
    return userAvatarCollection
      .readByQuery({ filter: { userId }, fields: 'id' })
      .then(_.path(['data', 0]))
      .then((item) => (
        item
          ? userAvatarCollection.updateOne(item.id, { image })
          : userAvatarCollection.createOne({ userId, image })
      ));
  };

  const getUserAvatar = ({ userId }) => userAvatarCollection
    .readByQuery({ filter: { userId } })
    .then(_.compose(_.omit(['id', 'userId']), _.path(['data', 0])));

  const deleteUserAvatar = ({ userId }) => userAvatarCollection
    .readByQuery({ filter: { userId } })
    .then(_.path(['data', 0]))
    .then((item) => {
      if (item) {
        userAvatarCollection.deleteOne(item.id);
      }
    });

  const getUserPassport = ({ userId }) => userPassportCollection
    .readByQuery({ filter: { userId } })
    .then(_.compose(_.omit(['id', 'userId']), _.path(['data', 0])));

  const getCityByTitle = (title) => cityCollection
    .readByQuery({ filter: { title } })
    .then(_.compose(
      throwIs(isEmptyOrNull, 'Not found'),
      _.path(['data', 0]),
    ));

  const getManagingCompanyById = (managingCompanyId) => managementCollection
    .readOne(managingCompanyId, { fields: 'uppLink,uppId' })
    .then(({ uppLink, uppId }) => ({ url: uppLink || '', code: uppId || '' }));

  const getZhkhInfoByManagingCompanyId = (managingCompanyId) => managementCollection
    .readOne(managingCompanyId, { fields: 'zhkhLogin,zhkhPassword,requisites.inn' })
    .then(({ zhkhLogin, zhkhPassword, requisites }) => ({ login: zhkhLogin || '', password: zhkhPassword || '', inn: requisites.inn || '' }));

  const getPollById = (id) => pollsCollection
    .readOne(id, { fields: '*, answers.*' });

  const getVacancyById = (id) => vacanciesCollection
    .readOne(
      id,
      {
        fields: [
          '*',
          'city.*',
          'responsibilities.*',
          'conditions.*',
          'requirements.*',
          'organization.*',
          'hr_manager.*',
        ],
      },
    );

  const news = ({ params, query }) => directusLegacy({
    method: 'get',
    url: `/items/news/${params.newsId || ''}`,
    params: query,
  });

  const logEdsRegisterError = (profileData) => edsRegisterFault.createOne(profileData);
  const logEdsServiceRegisterError = (profileData) => edsServiceRegisterFault
    .createOne(profileData);

  const createIndication = ({
    userId,
    profileId,
    residentId,
    value,
    date,
    image,
    name,
    serviceName,
  }) => residentIndicationsCollection.createOne({
    userId,
    profileId,
    residentId,
    value,
    date,
    image,
    name,
    serviceName,
  });

  const updateNewsStatistics = (data) => directusLegacy({
    method: 'post',
    url: '/news/update_statistics',
    data: { data },
  });

  const updatePollCounters = ({ query }) => directusLegacy({
    method: 'get',
    url: '/api/update_polls_data',
    params: query,
  });

  const deleteUserPassport = ({ userId }) => userPassportCollection
    .readByQuery({ filter: { userId } })
    .then(_.path(['data', 0]))
    .then((item) => {
      if (item) {
        userPassportCollection.deleteOne(item.id);
      }
    });

  const deleteUserIndications = ({ userId }) => residentIndicationsCollection
    .readByQuery({ filter: { userId } })
    .then(_.compose(
      _.forEach((item) => {
        if (item) {
          residentIndicationsCollection.deleteOne(item.id);
        }
      }),
      _.path(['data']),
    ));

  const deleteUserEdsProfileAdd = ({ userId }) => edsProfileAddCollection
    .readByQuery({ filter: { userId } })
    .then(_.compose(
      _.forEach((item) => {
        if (item) {
          edsProfileAddCollection.deleteOne(item.id);
        }
      }),
      _.path(['data']),
    ));

  const deleteUserEdsServicesProfileAdd = ({ userId }) => edsServicesProfileAddCollection
    .readByQuery({ filter: { userId } })
    .then(_.compose(
      _.forEach((item) => {
        if (item) {
          edsServicesProfileAddCollection.deleteOne(item.id);
        }
      }),
      _.path(['data']),
    ));

  return {
    uploadFiles,

    upsertUserPassport,
    getUserPassport,

    upsertUserAvatar,
    getUserAvatar,

    getCityByTitle,
    news,

    getManagingCompanyById,
    logEdsRegisterError,
    logEdsServiceRegisterError,
    getZhkhInfoByManagingCompanyId,

    getPollById,
    getVacancyById,
    createIndication,

    updateNewsStatistics,
    deleteUserAvatar,
    updatePollCounters,
    deleteUserPassport,
    deleteUserIndications,
    deleteUserEdsProfileAdd,
    deleteUserEdsServicesProfileAdd,
  };
};

module.exports = cmsExternal();
