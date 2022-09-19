const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');
const CyrillicToTranslit = require('cyrillic-to-translit-js');

const createFileObject = (file) => {
  const translit = new CyrillicToTranslit();

  return {
    // eslint-disable-next-line no-underscore-dangle
    path: file.path,
    name: `${Math.floor((+new Date()) / 1000)}_${translit.transform(file.filename, '_').toLowerCase()}`,
  };
};

const createFileInfo = (file) => ({
  name: file.Key.substring(file.Key.lastIndexOf('/') + 1, file.Key.length),
  link: (new URL(file.Location)).pathname,
});

const parseUploadResponse = (response) => {
  if (_.isNil(response)) return [];

  if (_.type(response) === 'Array') {
    return response.map((file) => createFileInfo(file));
  }

  return [createFileInfo(response)];
};

const createAppeal = async (
  {
    uppOrnExternal,
    residentProfileRepository,
    cmsExternal,
    userRepository,
    yandexS3External,
  },
  userId,
  {
    residentId,
    themeId,
    content,
    answerInPaperForm,
    files,
  },
) => {
  const resident = await residentProfileRepository.findByResidentIdAndUserId(
    residentId.value,
    userId,
  );

  if (!_.path(['residentAccount', 'managingCompanyId'], resident)) {
    throw new AppError(errorCodes.SERVER);
  }

  const managingCompany = await cmsExternal.getManagingCompanyById(
    resident.residentAccount.managingCompanyId,
  );

  if (!_.prop('code', managingCompany) || !_.prop('url', managingCompany)) {
    throw new AppError(errorCodes.EXTERNAL);
  }

  const user = await userRepository.get(userId, {
    user: ['phone', 'email'],
    profile: ['fullName'],
  });

  if (!_.prop('phone', user) || !_.path(['profile', 'fullName'], user)) {
    throw new AppError(errorCodes.SERVER);
  }

  const { address } = resident.residentAccount;

  let upload = null;

  if (!_.isNil(files)) {
    if (_.type(files) === 'Array') {
      const filesToUpload = files.map((file) => createFileObject(file));
      upload = await yandexS3External.upload(filesToUpload, '/appeals/');
    } else {
      upload = await yandexS3External.upload(createFileObject(files), '/appeals/');
    }
  }

  await uppOrnExternal.setUrl(managingCompany.url);
  const response = await uppOrnExternal.createAppeal({
    personalAccount: String(residentId.value),
    idUser: String(userId),
    themeId: themeId.value,
    username: user.profile.fullName.toUpperCase(),
    phonenumber: user.phone,
    email: user.email,
    address: address.result ? address.result : address.source,
    organizationCode: managingCompany.code,
    content: content.value || '',
    answerInPaperForm: answerInPaperForm.value,
    files: parseUploadResponse(upload),
  });

  if (!_.prop('success', response)) {
    parseUploadResponse(upload).map(async (file) => {
      await yandexS3External.remove(`/appeals/${file.name}`);
    });

    throw new AppError(errorCodes.EXTERNAL);
  }

  return response.data;
};

module.exports = createAppeal;
