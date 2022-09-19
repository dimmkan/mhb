/* eslint-disable class-methods-use-this */

const { transaction } = require('objection');
const first = require('shared/utils/helper/first');
const UserNotificationsModel = require('infrastructure/orm/objection/models/UserNotificationsObjection.model');

class UserNotificationsRepository {
  constructor() {
    this.transaction = transaction;
  }

  persist(userNotificationWithBody, { trx } = {}) {
    return UserNotificationsModel
      .query(trx)
      .insertGraph(userNotificationWithBody);
  }

  update(id, data, { trx } = {}) {
    return UserNotificationsModel
      .query(trx)
      .where('id', id)
      .update(data)
      .returning('*')
      .then(first);
  }

  remove(id, { trx } = {}) {
    return UserNotificationsModel
      .query(trx)
      .del()
      .where('id', id);
  }

  getByUserId(data) {
    return UserNotificationsModel
      .query()
      .where('user_id', data.id)
      .withGraphFetched('notification')
      .modifyGraph('notification', (builder) => {
        builder.select('*');
      })
      .orderBy('is_read', 'asc')
      .orderBy('created_at', 'desc')
      .offset((data.page - 1) * data.limit)
      .limit(data.limit);
  }

  getById(id) {
    return UserNotificationsModel
      .query()
      .where('id', id)
      .withGraphFetched('notification')
      .modifyGraph('notification', (builder) => {
        builder.select('title', 'description');
      });
  }

  getForMark(userId, messageId) {
    return UserNotificationsModel
      .query()
      .where('user_id', userId)
      .where('id', messageId)
      .first();
  }

  getCountByUserId(userId, isRead = [true, false]) {
    return UserNotificationsModel
      .query()
      .count()
      .where('user_id', userId)
      .whereIn('is_read', isRead)
      .first();
  }
}

module.exports = UserNotificationsRepository;
