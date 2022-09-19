module.exports = Object.freeze({
  GK_LOCAL_EVENT: {
    type: 'GK_LOCAL_EVENT',
    description: 'Бонус за участие в акциях ГК',
    amount: 1000,
  },
  GOOD_DEEDS_EVENT: {
    type: 'GOOD_DEEDS_EVENT',
    description: 'Бонус за «добрые дела»',
    amount: 500,
  },
  MANAGEMENT_COMPANY_REVIEW: {
    type: 'MANAGEMENT_COMPANY_REVIEW',
    description: 'Бонус за отзыв на УК',
    amount: 1000,
  },
  EMPLOYEE_EVENT: {
    type: 'EMPLOYEE_EVENT',
    description: 'Бонус сотрудникам Группы Компании',
    amount: 5000,
  },
  ADMIN_DEBIT: {
    type: 'ADMIN_DEBIT',
    description: 'Начисление бонусов',
  },
  ADMIN_CREDIT: {
    type: 'ADMIN_CREDIT',
    description: 'Списание бонусов',
  },
});
