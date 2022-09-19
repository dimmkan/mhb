const _ = require('ramda');
const { AppError, errorCodes } = require('shared/errors');
const VACANCIES_FIELDS_NAMES = require('shared/entities/vacanciesFieldsNames');

const convertToHtml = _.compose(
  _.join('<br><br>'),
  _.map(([key, value]) => {
    let formattedValue = '-';

    switch (value) {
      case 'male':
        formattedValue = 'Мужской';
        break;
      case 'female':
        formattedValue = 'Женский';
        break;
      case true:
        formattedValue = 'Да';
        break;
      case false:
        formattedValue = 'Нет';
        break;
      default:
        formattedValue = value;
        break;
    }
    return `<i><b>${VACANCIES_FIELDS_NAMES[key]}</b>: ${formattedValue}</i>`;
  }),
);

const vacancyResponse = async (
  dependencies,
  {
    vacancyId,
    files,
    userId,
    birthday,
    ...fields
  },
) => {
  const {
    cmsExternal,
    emailExternal,
    loyaltyManager,
    vacanciesResponsesRepository,
  } = dependencies;

  if (userId) {
    const userVacancyResponse = await vacanciesResponsesRepository.findByUserId(
      userId,
      vacancyId,
    );

    if (userVacancyResponse.length) throw new AppError(errorCodes.ALREADY_RESPONDED);
  }

  const vacancy = await cmsExternal.getVacancyById(vacancyId);
  if (!_.path(['hr_manager', 'email'], vacancy)) {
    throw new AppError(errorCodes.EXTERNAL, { description: 'Vacancy not found' });
  }

  const filesList = (files && [files].flat(1)) || [];

  const formatedBirthdate = new Date(birthday).toLocaleString('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  await emailExternal.send(
    vacancy.hr_manager.email,
    `<h1>Вакансия: ${vacancy.position}</h1>
    ${convertToHtml(Object.entries({ ...fields, birthday: formatedBirthdate }))}<br><br>`,
    'Отклик на вакансию',
    filesList,
  );

  if (userId) {
    const loyaltyTypes = loyaltyManager.types.user;
    await loyaltyManager.onceDebit(dependencies, {
      ...loyaltyTypes.JOB_RESPONSE,
      fingerprint: `${userId}:${vacancyId}:JOB_RESPONSE`,
    });

    const isResumeWriting = filesList.length > 0;
    if (isResumeWriting) {
      await loyaltyManager.onceDebit(dependencies, {
        ...loyaltyTypes.RESUME_WRITING,
        fingerprint: `${userId}:${vacancyId}:RESUME_WRITING`,
      });
    }

    await vacanciesResponsesRepository.persist({
      userId,
      vacancyId,
    });

    return {
      loyalty: isResumeWriting
        ? [loyaltyTypes.JOB_RESPONSE, loyaltyTypes.RESUME_WRITING]
        : [loyaltyTypes.JOB_RESPONSE],
    };
  }

  return undefined;
};

module.exports = vacancyResponse;
