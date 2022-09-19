const _ = require('ramda');
const env = require('infrastructure/config/env');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { stat } = require('fs').promises;
const { AppError, errorCodes } = require('shared/errors');
const renameObjectKeys = require('shared/utils/helper/renameObjectKeys');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const first = require('shared/utils/helper/first');

const edsServicesExternal = () => {
  const edsServices = axios.create({
    baseURL: env.EDS_SERVICES_EXT_PUBLIC_URL,
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${env.EDS_SERVICES_EXT_TOKEN}`,
    },
  });

  const isEdsError = _.anyPass([
    _.isNil,
    _.whereAny({
      error: _.is(Object),
      errors: _.is(Array),
    }),
  ]);

  const edsErrorDescription = _.path(['error', 'msg']);

  edsServices.interceptors.response.use(({ data }) => {
    if (isEdsError(data)) {
      throw new AppError(
        errorCodes.EXTERNAL,
        { origin: data.error, description: edsErrorDescription(data) },
      );
    }
    return _.propOr(data, 'response', data);
  });

  const uploadImages = (files) => {
    if (isEmptyOrNull(files)) throw new Error('Empty files');

    return Promise.all([files].flat(1).map(async (part) => {
      const form = new FormData();
      form.append(
        'picture',
        fs.createReadStream(part.path),
        { knownLength: (await stat(part.path)).size },
      );
      return edsServices({
        method: 'post',
        url: '/addphotoedsservice.php',
        data: form,
        headers: {
          ...form.getHeaders(),
          'Content-Length': form.getLengthSync(),
        },
      });
    }))
      .then(_.compose(
        _.map(_.compose(
          _.objOf('id'),
          _.prop('photo_id'),
        )),
        _.filter(_.prop('photo_id')),
      ));
  };

  const categoriesWithPrice = () => edsServices({
    params: {
      method: 'mhapi.categories.categories',
    },
  });

  const getProfileBonuses = ({ profileId }) => edsServices({
    params: {
      method: 'mhapi.bonuses.bonusesbyprofile',
      profileId,
    },
  }).then(first);

  const setProfileNotificationsStatus = ({ profileId, status }) => edsServices({
    params: {
      method: 'mhapi.notifications.options',
      profileId,
      status: status ? 1 : 0,
    },
  });

  const paymentUrl = ({
    requestId,
    bonuses,
    tips,
    tipsFromBonuses,
    transactionId,
  }) => edsServices({
    params: {
      method: 'mhapi.payment.payment',
      requestId,
      bonuses,
      tips,
      tipsFromBonuses,
      transactionId: transactionId || null,
    },
  });

  const applyRequestPayment = ({ requestId }) => edsServices({
    params: {
      method: 'mhapi.payment.testpayment',
      requestId,
    },
  });

  const getProfileByPhone = (phone) => edsServices({
    params: {
      method: 'mhapi.profile.byphone',
      phone,
    },
  });

  const getProfile = (id) => edsServices({
    params: {
      method: 'mhapi.profile.profileid',
      profileId: id,
    },
  });

  const createProfile = ({
    fullName, email, phone, address,
  }) => edsServices({
    params: {
      method: 'mhapi.profile.adduser',
      client_name: fullName,
      email,
      phone,
      address,
    },
  }).then(_.compose((v) => parseInt(v, 10), first));

  const getRequests = ({ profileId, page, limit }) => edsServices({
    params: {
      method: 'mhapi.request.byprofile',
      profileId,
      page,
      nPageSize: limit,
    },
  });

  const getRequest = (requestId) => edsServices({
    params: {
      method: 'mhapi.request.byrequestid',
      requestId,
    },
  }).then(first);

  const renameCreateRequestBody = renameObjectKeys({
    profileId: 'user_id',
    category_id: 'sid',
    flat: 'kvart',
    entrance: 'podezd',
    building: 'stroenie',
    corpus: 'building',
    value: 'address_id',
  });

  const parseBlockType = ({ blockType, block }) => {
    switch (blockType) {
      case 'к': {
        const [corpus, building] = block.split('стр').map(_.trim);
        return { corpus, building };
      }
      case 'стр': {
        return { building: block };
      }
      default: {
        return {};
      }
    }
  };

  const createRequest = ({ images, address, ...requestBody }) => {
    const photos = images && [images].flat(1).reduce(
      (acc, id, index) => {
        acc[`foto${index + 1}`] = id;
        return acc;
      },
      {},
    );
    return edsServices({
      params: {
        method: 'mhapi.request.additem',
        ...renameCreateRequestBody({
          ...requestBody,
          ...address,
          ...parseBlockType(address),
          ...photos,
        }),
      },
    })
      .then(_.compose(getRequest, first));
  };

  return {
    uploadImages,
    categoriesWithPrice,
    paymentUrl,
    applyRequestPayment,

    getProfileBonuses,
    getProfileByPhone,
    getProfile,
    createProfile,
    setProfileNotificationsStatus,

    getRequest,
    createRequest,
    getRequests,
  };
};

module.exports = edsServicesExternal();
