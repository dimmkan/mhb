const axios = require('axios');
const env = require('infrastructure/config/env');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');
const first = require('shared/utils/helper/first');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const FormData = require('form-data');
const fs = require('fs');
const throwIs = require('shared/utils/helper/throwIs');

const client = () => {
  const instance = axios.create({
    baseURL: env.EDS_EXT_PUBLIC_URL,
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${env.EDS_EXT_TOKEN}`,
      accept: 'application/json',
    },
  });

  instance.interceptors.response.use(
    ({ data }) => {
      if (data && Array.isArray(data.errors)) {
        throw new AppError(
          errorCodes.EXTERNAL,
          {
            origin: data.error,
            description: data.error.msg,
          },
        );
      }
      return _.propOr(data, 'response', data);
    },
  );

  const createEdsAccount = (data) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.profile.adduser',
      ...data,
    },
  })
    .then(first);

  const getRequestList = (data) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.request.byprofile',
      ...data,
    },
  });

  const getCategories = () => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.categories.categories',
    },
  });

  const sendFileToEds = (files) => {
    if (isEmptyOrNull(files)) throw new Error('Empty files');

    return Promise.all([files].flat(1).map((part) => {
      const form = new FormData();
      form.append(
        'picture',
        fs.createReadStream(part.path),
        { knownLength: fs.statSync(part.path).size },
      );
      return instance({
        method: 'POST',
        url: '/addphotoeds.php',
        data: form,
        headers: {
          ...form.getHeaders(),
          'Content-Length': form.getLengthSync(),
        },
      }).then(
        _.path(['photo_name']),
      );
    }));
  };

  const createRequest = async (data) => {
    const photoObject = data.images && [data.images].flat(1).reduce(
      (acc, item, index) => {
        acc[`foto${index + 1}`] = item;
        return acc;
      },
      {},
    );
    const build = `${data.blockType} ${data.block}`;
    const buidings = {
      stroenie: build.startsWith('с') ? build : '',
      korpus: build.startsWith('к') ? build : '',
    };
    const requestId = await instance.get('/', {
      params: {
        method: 'mhapieds.request.additem',
        user_id: data.user_id,
        district: data.cityDistrict,
        street: `${data.street} ${data.streetType}`,
        kvartira: data.flat,
        podezd: data.entrance,
        ...buidings,
        ..._.pick(
          ['city',
            'topic_id',
            'description',
            'delayed_date',
            'delayed_time',
            'house'],
          data,
        ),
        ...photoObject,
      },
    }).then(first);
    return instance({
      method: 'GET',
      url: '/',
      params: {
        method: 'mhapieds.request.byrequestid',
        requestId,
      },
    }).then(first);
  };

  const confirmOrRejectRequest = (data) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.request.confirmrequest',
      ...data,
    },
  }).then(_.compose(
    _.objOf('response'),
    first,
  ));

  const getCurrentShutdownsList = (edsId) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.planotkl.listotklucheni',
      profileid: edsId,
    },
  });

  const getPlannedShutdownsList = (edsId) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.planotkl.listotklucheniplan',
      profileid: edsId,
    },
  });

  const getRequest = (requestId) => instance({
    method: 'GET',
    url: '/',
    params: {
      method: 'mhapieds.request.byrequestid',
      requestId,
    },
  }).then(
    _.compose(
      first,
      throwIs(isEmptyOrNull, 'Request not found'),
    ),
  );

  const setProfileNotificationsStatus = ({ profileId, status }) => instance({
    params: {
      method: 'mhapieds.profile.notifications',
      profileId,
      status: status ? 1 : 0,
    },
  });

  return {
    createEdsAccount,
    getRequestList,
    getCategories,
    sendFileToEds,
    createRequest,
    confirmOrRejectRequest,
    getCurrentShutdownsList,
    getPlannedShutdownsList,
    getRequest,
    setProfileNotificationsStatus,
  };
};

module.exports = client();
