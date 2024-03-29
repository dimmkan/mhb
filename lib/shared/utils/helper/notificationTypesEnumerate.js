const NOTIFICATION_STATUS_ENUMERATE = {
  CONFIRM_USER_NOTIFICATION: 'CONFIRM_USER_NOTIFICATION',
  ACCEPT_USER_NOTIFICATION: 'ACCEPT_USER_NOTIFICATION',
  DECLINE_USER_NOTIFICATION: 'DECLINE_USER_NOTIFICATION',
  ADMINISTRATIVE_NOTIFICATION_BY_USER: 'ADMINISTRATIVE_NOTIFICATION_BY_USER',
  ADMINISTRATIVE_NOTIFICATION_BY_MANAGING_COMPANY: 'ADMINISTRATIVE_NOTIFICATION_BY_MANAGING_COMPANY',
  ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS: 'ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS',
  RATE_QUALITY_NOTIFICATION: 'RATE_QUALITY_NOTIFICATION',
  RATE_APPEAL_QUALITY_NOTIFICATION: 'RATE_APPEAL_QUALITY_NOTIFICATION',
  DELETE_USER_NOTIFICATION: 'DELETE_USER_NOTIFICATION',
  ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS_FOR_OSS: 'ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS_FOR_OSS',
  EDS_CHANGE_REQUEST_STATUS: 'EDS_CHANGE_REQUEST_STATUS',
  EDS_REQUEST_DONE: 'EDS_REQUEST_DONE',
  EDS_PLANNIG_SHUTDOWN: 'EDS_PLANNIG_SHUTDOWN',
  EDS_EMERGENCY_SHUTDOWN: 'EDS_EMERGENCY_SHUTDOWN',
  EDS_SERVICE_CHANGE_REQUEST_STATUS: 'EDS_SERVICE_CHANGE_REQUEST_STATUS',
  EDS_SERVICE_REQUEST_DONE: 'EDS_SERVICE_REQUEST_DONE',
  ADMINISTRATIVE_APPEALS_CHANGE_STATUS: 'ADMINISTRATIVE_APPEALS_CHANGE_STATUS',
  POLLS_NOTIFICATION: 'POLLS_NOTIFICATION',
};

Object.freeze(NOTIFICATION_STATUS_ENUMERATE);

module.exports = NOTIFICATION_STATUS_ENUMERATE;
