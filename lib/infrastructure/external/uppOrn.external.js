const axios = require('axios');
const _ = require('ramda');
const env = require('infrastructure/config/env');

const initAxios = (baseURL, username, password) => {
  const newInstance = axios.create({
    baseURL,
    timeout: 60000,
    auth: {
      username,
      password,
    },
  });

  newInstance.interceptors.response.use(
    _.prop('data'),
    _.path(['response', 'data']),
  );

  return newInstance;
};

const client = () => {
  let instance = initAxios(
    env.UPP_ORN_EXT_PUBLIC_URL,
    env.UPP_ORN_EXT_LOGIN,
    env.UPP_ORN_EXT_PASSWORD,
  );

  return {
    setUrl: (url = '') => {
      instance = initAxios(
        url || env.UPP_ORN_EXT_PUBLIC_URL,
        env.UPP_ORN_EXT_LOGIN,
        env.UPP_ORN_EXT_PASSWORD,
      );
    },

    getThemes: () => instance
      .get('/getThemes'),

    getManager: (orgCode) => instance
      .request({
        method: 'GET',
        url: '/getManager',
        data: {
          organizationCode: orgCode,
        },
      }),

    getScheduleOfAppointments: (orgCode) => instance
      .request({
        method: 'GET',
        url: '/getScheduleOfAppointments',
        data: {
          organizationCode: orgCode,
        },
      }),

    getAppointments: (personalAccount, username, address) => instance
      .request({
        method: 'GET',
        url: '/getAppointments',
        data: {
          personalAccount: String(personalAccount),
          userName: username,
          address,
        },
      }),

    createAppointment: (data) => instance
      .request({
        method: 'POST',
        url: '/createAppointment',
        data,
      }),

    cancelAppointment: (id) => instance
      .request({
        method: 'POST',
        url: '/cancelAppointment',
        data: {
          id,
        },
      }),

    putGrade: (id, grade, text) => instance
      .request({
        method: 'POST',
        url: '/putGrade',
        data: {
          id,
          grade,
          text,
        },
      }),

    createAppeal: (data) => instance
      .request({
        method: 'POST',
        url: '/createAppeal',
        data,
      }),

    getAppeals: (personalAccount, username, address) => instance
      .request({
        method: 'GET',
        url: '/getAppeals',
        data: {
          personalAccount: String(personalAccount),
          userName: username,
          address,
        },
      }),
  };
};

module.exports = client();
