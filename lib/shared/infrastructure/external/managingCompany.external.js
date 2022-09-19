const env = require('infrastructure/config/env');

const client = () => ({
  getManagingCompanyById: (managingCompanyId = null) => ({
    url: env.UPP_ORN_EXT_PUBLIC_URL,
    code: 'ЖС',
  }),
});

module.exports = client();
