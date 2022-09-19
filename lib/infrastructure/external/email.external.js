const fs = require('fs');
const axios = require('axios');
const _ = require('ramda');
const FormData = require('form-data');
const env = require('infrastructure/config/env');
const { AppError, errorCodes } = require('shared/errors');

const client = () => {
  const instance = axios.create({
    baseURL: env.SMS_EXT_PUBLIC_URL,
    timeout: 60000,
    params: {
      login: env.SMS_EXT_LOGIN,
      psw: env.SMS_EXT_PASSWORD,
      fmt: 3,
      charset: 'utf8',
    },
  });

  instance.interceptors.response.use(
    _.prop('data'),
    _.path(['response', 'data']),
  );

  return {
    send: (email, message, subject, files = []) => {
      const formData = new FormData();

      if (files.length) {
        for (let i = 0; i < files.length; i += 1) {
          formData.append(i, fs.readFileSync(files[i].path), { filename: files[i].filename });
        }
      }

      return instance
        .request({
          method: 'POST',
          url: '/sys/send.php',
          params: {
            phones: email,
            mes: message,
            subj: subject,
            sender: env.EMAIL_EXT_SENDER,
            mail: 1,
          },
          data: formData,
        }).then((r) => {
          if (r.error) throw new AppError(errorCodes.EXTERNAL, { description: r.error });
          return r;
        });
    },
  };
};

module.exports = client();
