const getFormData = require('application/use_cases/appeals/getFormData');
const getAppeals = require('application/use_cases/appeals/getAppeals');
const createAppeal = require('application/use_cases/appeals/createAppeal');
const putGrade = require('application/use_cases/appointments/putGrade');

async function getFormDataHandler(req) {
  const { id } = req.authCredentials;
  const { residentId } = req.params;
  const themes = await getFormData(this.serviceLocator, id, residentId);

  return themes;
}

async function getAppealsHandler(req) {
  const { id } = req.authCredentials;
  const { residentId } = req.params;
  const res = await getAppeals(this.serviceLocator, id, residentId);

  return res;
}

async function createAppealHandler(req) {
  const { id: userId } = req.authCredentials;
  const res = await createAppeal(this.serviceLocator, userId, { ...req.body });

  return res;
}

async function putGradeHandler(req) {
  const { id: userId } = req.authCredentials;
  await putGrade(this.serviceLocator, userId, { ...req.body }, 'appeals');

  return { success: true };
}

module.exports = {
  getFormDataHandler,
  getAppealsHandler,
  createAppealHandler,
  putGradeHandler,
};
