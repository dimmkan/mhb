const { AppError, errorCodes } = require('shared/errors');

const categoriesWithPrice = async ({
  edsServicesExternal,
}) => {
  try {
    const categories = await edsServicesExternal.categoriesWithPrice();
    return categories;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = categoriesWithPrice;
