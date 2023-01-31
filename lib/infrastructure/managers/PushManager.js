/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

const firebase = require('firebase-admin');
const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');
const _ = require('ramda');
const env = require('infrastructure/config/env');

class PushManager {
  constructor() {
    this.firebase = firebase.initializeApp({
      credential: firebase.credential.cert({
        type: env.FIREBASE_ACC_TYPE,
        project_id: env.FIREBASE_PROJECT_ID,
        private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
        private_key: env.FIREBASE_PRIVATE_KEY,
        client_email: env.FIREBASE_CLIENT_EMAIL,
        client_id: env.FIREBASE_CLIENT_ID,
        auth_uri: env.FIREBASE_AUTH_URI,
        token_uri: env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: env.FIREBASE_AUTH_PROVIDER,
        client_x509_cert_url: env.FIREBASE_CLIENT_X509,
      }),
    });
  }

  generateTitle(messageType) {
    let title = '';
    switch (messageType) {
      case notificationEnum.CONFIRM_USER_NOTIFICATION:
      case notificationEnum.ACCEPT_USER_NOTIFICATION:
      case notificationEnum.DECLINE_USER_NOTIFICATION:
        title = 'Добавление аккаунта';
        break;
      case notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_USER:
      case notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_MANAGING_COMPANY:
      case notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS:
        title = 'Оповещение от администратора';
        break;
      case notificationEnum.RATE_QUALITY_NOTIFICATION:
      case notificationEnum.RATE_APPEAL_QUALITY_NOTIFICATION:
        title = 'Оценка качества';
        break;
      case notificationEnum.ADMINISTRATIVE_NOTIFICATION_BY_ADDRESS_FOR_OSS:
        title = 'Общее собрание собственников';
        break;
      case notificationEnum.EDS_CHANGE_REQUEST_STATUS:
        title = 'Изменение статуса заявки ЕДС';
        break;
      case notificationEnum.EDS_REQUEST_DONE:
        title = 'Выполнение заявки ЕДС';
        break;
      case notificationEnum.EDS_SERVICE_CHANGE_REQUEST_STATUS:
        title = 'Изменение статуса заявки ЕДС.Услуги';
        break;
      case notificationEnum.EDS_SERVICE_REQUEST_DONE:
        title = 'Выполнение заявки ЕДС.Услуги';
        break;
      case notificationEnum.EDS_PLANNIG_SHUTDOWN:
        title = 'Уведомление о плановом отключении';
        break;
      case notificationEnum.EDS_EMERGENCY_SHUTDOWN:
        title = 'Уведомление об аварийном отключении';
        break;
      case notificationEnum.ADMINISTRATIVE_APPEALS_CHANGE_STATUS:
        title = 'Уведомление по обращению к администратору';
        break;
      default:
    }
    return title;
  }

  async generateBody(messageType, data) {
    let description = '';
    switch (messageType) {
      case notificationEnum.CONFIRM_USER_NOTIFICATION:
        description = `Подтвердите заявку на привязку Вашего лицевого счёта пользователем ${data.fullName}`;
        break;
      case notificationEnum.ACCEPT_USER_NOTIFICATION:
        description = 'Ваша заявка на привязку лицевого счёта одобрена, вы можете продолжить работу';
        break;
      case notificationEnum.DECLINE_USER_NOTIFICATION:
        description = 'Ваша заявка на привязку лицевого счёта была отклонена. Если у вас остались вопросы - обратитесь к администратору.';
        break;
      case notificationEnum.RATE_QUALITY_NOTIFICATION:
        description = `Оцените качество приема по теме "${data.theme}", который состоялся ${data.date} г. и получите 1000 бонусных баллов.`;
        break;
      case notificationEnum.RATE_APPEAL_QUALITY_NOTIFICATION:
        description = `Оцените качество работы по обращению по теме "${data.theme}" от ${data.date} г. и получите 1000 бонусных баллов.`;
        break;
      case notificationEnum.EDS_CHANGE_REQUEST_STATUS:
      case notificationEnum.EDS_SERVICE_CHANGE_REQUEST_STATUS:
        description = `Вашей заявке №${data.item_id} по ‘${data.description.length > 150 ? data.category : data.description}’ присвоен статус “${data.status}”`;
        break;
      case notificationEnum.EDS_REQUEST_DONE:
        description = `Ваша заявка №${data.item_id} по ‘${data.description.length > 150 ? data.category : data.description}’ выполнена. Просим подтвердить факт выполнения работ в системе “Наш дом”`;
        break;
      case notificationEnum.EDS_SERVICE_REQUEST_DONE:
        description = `Ваша заявка №${data.item_id} по ‘${data.description.length > 150 ? data.category : data.description}’ выполнена. Сумма заявки составляет: ${data.sum} рублей.`;
        break;
      case notificationEnum.ADMINISTRATIVE_APPEALS_CHANGE_STATUS:
        description = `Ваше обращение к администратору по теме "${data.subject}" было ${data.status === 'closed' ? 'завершено.' : 'отклонено.'}`;
        break;
      default:
    }
    return description;
  }

  async sendToUser(serviceLocator, data) {
    const {
      userNotificationsRepository,
      userNotificationTokensRepository,
      logger,
    } = serviceLocator;
    const { type } = data;
    const title = data.title ? data.title : this.generateTitle(type);
    const body = data.body ? data.body : await this.generateBody(type, data);
    const userFirebaseTokens = await userNotificationTokensRepository.getByUserId(data.userId);
    const savingMessage = await userNotificationsRepository.persist({
      type,
      userId: data.userId,
      isRead: false,
      notification: { title, body, payload: _.omit(['title', 'body'], data) },
    });
    const sendingMessage = this.generateMessage(title, body, {
      ..._.omit(['title', 'body'], data),
      messageId: savingMessage.id,
    });
    for (const item of userFirebaseTokens) {
      if (item.firebaseToken) {
        this.sendToDevice(logger, userNotificationTokensRepository, item.firebaseToken, sendingMessage);
      }
    }
    return { success: true };
  }

  async sendToUsers(serviceLocator, data) {
    const {
      notificationRepository,
      userNotificationsRepository,
      userNotificationTokensRepository,
      logger,
    } = serviceLocator;
    const { type, body } = data;
    const title = data.title ? data.title : this.generateTitle(type);
    const notification = await notificationRepository.persist({ title, body, payload: _.omit(['title', 'body', 'userIds'], data) });
    const messageArray = [];
    for (const userId of data.userIds) {
      messageArray.push({
        isRead: false,
        type,
        userId,
        notificationId: notification.id,
      });
    }
    await userNotificationsRepository.persist(messageArray);
    const sendingMessage = this.generateMessage(title, body, {
      ..._.omit(['title', 'body', 'userIds'], data),
    });
    const chunkArray = this.spliceIntoChunks(_.map(_.path(['firebaseToken']), await userNotificationTokensRepository.getByUserIds(data.userIds)), 450);
    for (const chunk of chunkArray) {
      sendingMessage.tokens = chunk.filter((item) => !!item);
      await this.sendMulticast(sendingMessage, logger);
    }
    return { success: true };
  }

  sendToDevice(logger, userNotificationTokensRepository, firebaseToken, message, options = {}) {
    return this.firebase
      .messaging()
      .sendToDevice(firebaseToken, message, options)
      .then()
      .catch(async (error) => {
        if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
          await userNotificationTokensRepository.remove(_.map(_.path(['id']), await userNotificationTokensRepository.getIdByKey(firebaseToken)));
        }
        logger.warn(error, {
          input: {
            firebaseToken,
            message,
            options,
          },
          type: 'notification.sendToDevice',
        });
      });
  }

  sendMulticast(message, logger) {
    return this.firebase
      .messaging()
      .sendMulticast(message)
      .then()
      .catch((error) => {
        logger.warn(error, {
          type: 'notification.sendMulticast',
        });
      });
  }

  generateMessage(title, body, payload) {
    for (const key in payload) payload[key] = payload[key].toString();
    return {
      notification: {
        title,
        body,
      },
      data: {
        ...payload,
      },
    };
  }

  spliceIntoChunks(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
      const chunk = arr.splice(0, chunkSize);
      res.push(chunk);
    }
    return res;
  }
}

module.exports = PushManager;
