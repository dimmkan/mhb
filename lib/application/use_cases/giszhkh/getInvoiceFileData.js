const slugify = require('slugify');
const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');

const slug = (text) => slugify(text, {
  replacement: '_',
  lower: true,
  strict: false,
  trim: true,
});

const slugEditorJsFirstText = _.compose(
  slug,
  _.replace(/-*$/, '_'),
  _.replace(/&nbsp/g, ''),
  _.replace(/[*±+~:;^'"()!?@$%#]|<[^>]*>/g, ''),
  _.trim,
);

async function getInvoiceFileData(serviceLocator, { residentProfileId, fileId }) {
  const {
    residentProfileRepository,
    cmsExternal,
    reformaZhkhExternal,
  } = serviceLocator;
  const profileData = await residentProfileRepository.get(residentProfileId, {
    fields: {
      residentAccount: ['*'],
    },
  });
  const { login, password } = await cmsExternal
    .getZhkhInfoByManagingCompanyId(profileData.residentAccount.managingCompanyId);

  if (!login || !password) throw new AppError(errorCodes.NOT_FOUND, { descriptionRu: 'Данные о доме в системе отсутствуют', message: 'Данные для авторизации не найдены' });

  try {
    const invoiceFileData = await reformaZhkhExternal
      .getFileById({ login, password }, { file_id: fileId });

    invoiceFileData.name = slugEditorJsFirstText(invoiceFileData.name);
    return invoiceFileData;
  } catch (e) {
    throw new AppError(errorCodes.BAD_REQUEST, { descriptionRu: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.', message: 'Ошибка получения данных для указанного лицевого счета и УК. Попробуйте еще раз позднее.' });
  }
}

module.exports = getInvoiceFileData;
