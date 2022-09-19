module.exports = Object.freeze({
  REGISTRATION: {
    type: 'REGISTRATION',
    description: 'Приветственный бонус за регистрацию',
    amount: 5000,
  },
  ACTIVITY: {
    type: 'ACTIVITY',
    description: 'Бонус за вход в приложение и портал (ежедневный бонус)',
    amount: 100,
  },
  EDS_REQ_CLOSE: {
    type: 'EDS_REQ_CLOSE',
    description: 'Бонус за закрытие заявки в ЕДС',
    amount: 500,
  },
  EDS_SERVICES_REQ: {
    type: 'EDS_SERVICES_REQ',
    description: 'Бонус за заявку в ЕДС-Услуги',
  },
  CREATE_INDICATION: {
    type: 'CREATE_INDICATION',
    description: 'Бонус за передачу показаний счетчиков в отведенное время',
    amount: 300,
  },
  POLL_PARTIPATION: {
    type: 'POLL_PARTIPATION',
    description: 'Бонус за участие в опросе',
    amount: 1000,
  },
  PERCONAL_RECEPTION_REVIEW: {
    type: 'PERCONAL_RECEPTION_REVIEW',
    description: 'Бонус за оценку после личного приема',
    amount: 1000,
  },
  APPEALS_REVIEW: {
    type: 'APPEALS_REVIEW',
    description: 'Бонус за оценку после обращения',
    amount: 1000,
  },
  MOST_ACTIVE: {
    type: 'MOST_ACTIVE',
    description: 'Бонус самым активным пользователям портала',
    amount: 5000,
  },
  JOB_RESPONSE: {
    type: 'JOB_RESPONSE',
    description: 'Бонус за отклик на вакансию',
    amount: 1500,
  },
  RESUME_WRITING: {
    type: 'RESUME_WRITING',
    description: 'Бонус за оформление резюме через приложение/портал',
    amount: 1000,
  },
  PASSPORT_VERIFICATION: {
    type: 'PASSPORT_VERIFICATION',
    description: 'Бонус за верификацию паспортных данных',
    amount: 10000,
  },
  EDS_SERVICE_REQ_PAYMENT: {
    type: 'EDS_SERVICE_REQ_PAYMENT',
    description: 'Оплата услуги ЕДС',
  },
});
