const indicationsReport = require('./indicationsReport');
const newsMetaReport = require('./newsMetaReport');
const registrationRequestClearCache = require('./registrationRequestClearCache');
const loyaltyInvitationClearCache = require('./loyaltyInvitationClearCache');
const loyaltyOperationClearCache = require('./loyaltyOperationClearCache');

module.exports = {
  run: async (dependencies) => {
    indicationsReport(dependencies);
    newsMetaReport(dependencies);
    registrationRequestClearCache(dependencies);
    loyaltyInvitationClearCache(dependencies);
    loyaltyOperationClearCache(dependencies);
  },
};
