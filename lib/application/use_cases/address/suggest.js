const { AppError, errorCodes } = require('shared/errors');
const camelCaseObjectKeys = require('shared/utils/helper/camelCaseObjectKeys');

async function suggest({ dadataExternal }, { str }) {
  try {
    const { suggestions } = await dadataExternal.suggestionsAddress(str);
    return suggestions.map(({ data, ...meta }) => ({
      ...camelCaseObjectKeys(meta),
      data: camelCaseObjectKeys(data),
    }));
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
}

module.exports = suggest;
