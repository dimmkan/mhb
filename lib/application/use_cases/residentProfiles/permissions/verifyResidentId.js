const { AppError, errorCodes } = require('shared/errors');
const _ = require('ramda');

const chargesValues = _.compose(
  _.filter((x) => !!x),
  _.flatten,
  _.map(_.paths([['charged'], ['pay', 'non_insurance'], ['pay', 'with_insurance']])),
  _.values,
  _.omit(['last_date']),
);

module.exports = async function verifyResidentId(
  { nedolzhnikExternal, managingCompanyExternal },
  { residentId, paidByReceipt },
) {
  const residentCharges = await nedolzhnikExternal.getCharge(residentId)
    .catch(() => {
      throw new AppError(errorCodes.BAD_RESIDENT_ID);
    });

  if (!chargesValues(residentCharges).includes(paidByReceipt)) {
    throw new AppError(errorCodes.INCORRECT_RESIDENT_ID_PAYMENT_RECEIPT);
  }

  const { name: nId } = await nedolzhnikExternal.getManagingCompany(residentId);
  try {
    const company = await managingCompanyExternal.getByNId(nId.replace(/("|')/g, ''), { fields: 'id' });
    if (!company) {
      throw new AppError(errorCodes.BAD_REQUEST, { description: 'Managing company not found', descriptionRu: 'Управляющая компания не найдена' });
    }
  } catch (e) {
    throw new AppError(errorCodes.BAD_REQUEST, { description: 'Managing company not found', descriptionRu: 'Управляющая компания не найдена' });
  }

  return true;
};
