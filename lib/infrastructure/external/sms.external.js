const axios = require('axios');
const _ = require('ramda');
const env = require('infrastructure/config/env');

const client = () => {
  const instance = axios.create({
    baseURL: env.SMS_EXT_PUBLIC_URL,
    timeout: 60000,
    params: {
      login: env.SMS_EXT_LOGIN,
      psw: env.SMS_EXT_PASSWORD,
      sender: env.SMS_EXT_SENDER,
      fmt: 3,
      charset: 'utf8',
    },
  });

  instance.interceptors.response.use(
    _.prop('data'),
    _.path(['response', 'data']),
  );

  return {
    send: (phones, message) => instance
      .request({
        method: 'POST',
        url: '/sys/send.php',
        params: {
          phones: [phones].flat(1).join(','),
          mes: message,
        },
      }),
  };
};

module.exports = client();
