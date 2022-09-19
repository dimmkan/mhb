const _ = require('ramda');
const EasyYandexS3 = require('easy-yandex-s3');
const { AppError, errorCodes } = require('shared/errors');
const env = require('infrastructure/config/env');

const client = () => {
  const instance = new EasyYandexS3({
    auth: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    Bucket: env.S3_BUCKET_NAME,
  });

  return {
    upload: async (...args) => {
      const response = await instance.Upload(...args);

      if (
        (_.type(response) !== 'Array' && !_.prop('Location', response))
        || (_.type(response) === 'Array' && !_.prop('Location', response[0]))
      ) {
        throw new AppError(errorCodes.EXTERNAL);
      }

      return response;
    },

    remove: async (...args) => {
      const response = await instance.Remove(...args);

      if (!response) throw new AppError(errorCodes.EXTERNAL);

      return response;
    },
  };
};

module.exports = client();
