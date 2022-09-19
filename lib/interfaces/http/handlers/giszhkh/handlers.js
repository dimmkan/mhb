const { Readable } = require('stream');

const getGeneralInformation = require('application/use_cases/giszhkh/getGeneralInformation');
const getInvoiceFileData = require('application/use_cases/giszhkh/getInvoiceFileData');
const getPeriodList = require('application/use_cases/giszhkh/getPeriodList');
const getManagingReport = require('application/use_cases/giszhkh/getManagingReport');

async function getGeneralInformationHandler(req) {
  const { id } = req.params;
  return getGeneralInformation(this.serviceLocator, id);
}

async function downloadInvoiceHandler(req, reply) {
  const { id } = req.params;
  const { fileId } = req.query;
  const fileData = await getInvoiceFileData(
    this.serviceLocator,
    { residentProfileId: id, fileId },
  );
  reply.header('Content-Disposition', `attachment; filename="${fileData.name}"`);
  reply.send(Readable.from(Buffer.from(fileData.data.toString(), 'base64')));
}

async function getPeriodListHandler(req) {
  const { id } = req.params;
  return getPeriodList(this.serviceLocator, id);
}

async function getManagingReportHandler(req) {
  const { id } = req.params;
  const { periodId } = req.query;
  return getManagingReport(this.serviceLocator, { residentProfileId: id, periodId });
}

module.exports = {
  getGeneralInformationHandler,
  downloadInvoiceHandler,
  getPeriodListHandler,
  getManagingReportHandler,
};
