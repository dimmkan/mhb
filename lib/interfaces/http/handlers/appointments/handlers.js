const _ = require('ramda');

const getFormData = require('application/use_cases/appointments/getFormData');
const getAppointments = require('application/use_cases/appointments/getAppointments');
const createAppointment = require('application/use_cases/appointments/createAppointment');
const cancelAppointment = require('application/use_cases/appointments/cancelAppointment');
const putGrade = require('application/use_cases/appointments/putGrade');
const putGradeWebhook = require('application/use_cases/appointments/putGradeWebhook');

async function getFormDataHandler(req) {
  const { id: userId } = req.authCredentials;
  const { residentId } = req.params;
  const res = await getFormData(this.serviceLocator, userId, residentId);

  return res;
}

async function getAppointmentsHandler(req) {
  const { id: userId } = req.authCredentials;
  const { residentId } = req.params;
  const res = await getAppointments(this.serviceLocator, userId, residentId);

  return res;
}

async function createAppointmentHandler(req) {
  const { id: userId } = req.authCredentials;
  const res = await createAppointment(this.serviceLocator, userId, { ...req.body });

  return res;
}

async function cancelAppointmentHandler(req) {
  const { id: userId } = req.authCredentials;
  await cancelAppointment(this.serviceLocator, userId, { ...req.body });

  return { success: true };
}

async function putGradeHandler(req) {
  const { id: userId } = req.authCredentials;
  await putGrade(this.serviceLocator, userId, { ...req.body }, 'appointments');

  return { success: true };
}

async function putGradeWebhookHandler(req) {
  return putGradeWebhook(this.serviceLocator, { ...req.body });
}

module.exports = {
  getFormDataHandler,
  getAppointmentsHandler,
  createAppointmentHandler,
  cancelAppointmentHandler,
  putGradeHandler,
  putGradeWebhookHandler,
};
