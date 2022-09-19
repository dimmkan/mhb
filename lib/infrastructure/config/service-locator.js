const pino = require('pino');

//* * External */
const nedolzhnikExternal = require('infrastructure/external/nedolzhnik.external');
const uppOrnExternal = require('infrastructure/external/uppOrn.external');
const smsExternal = require('infrastructure/external/sms.external');
const dadataExternal = require('infrastructure/external/dadata.external');
const managingCompanyExternal = require('infrastructure/external/managingCompany.external');
const emailExternal = require('infrastructure/external/email.external');
const managingCompanyExternalMock = require('shared/infrastructure/external/managingCompany.external');
const cmsExternal = require('infrastructure/external/cms.external');
const edsExternal = require('infrastructure/external/eds.external');
const edsServicesExternal = require('infrastructure/external/edsServices.external');
const yandexS3External = require('infrastructure/external/yandexS3.external');
const reformaZhkhExternal = require('infrastructure/external/reformaZhkh.external');

//* * Manager */
const hashManager = require('infrastructure/security/HashManager');
const jwtTokenManager = require('infrastructure/security/JwtTokenManager');
const PushManager = require('infrastructure/managers/PushManager');
const loyaltyManager = require('infrastructure/managers/loyaltyManager');

//* * Repository */
const UserObjectionRepository = require('infrastructure/repositories/UserObjection.repository');
const ResidentProfileObjectionRepository = require('infrastructure/repositories/ResidentProfileObjection.repository');
const ConfirmationTokenKnexRepository = require('infrastructure/repositories/ConfirmationTokenKnex.repository');
const RefreshTokenKnexRepository = require('infrastructure/repositories/RefreshTokenKnex.repository');
const UserNotificationTokensRepository = require('infrastructure/repositories/UserNotificationTokensKnex.repository');
const NotificationRepository = require('infrastructure/repositories/NotificationKnex.repository');
const UserNotificationsRepository = require('infrastructure/repositories/UserNotificationsObjection.repository');
const TargetRateKnexRepository = require('infrastructure/repositories/TargetRateKnex.repository');
const TargetViewsKnexRepository = require('infrastructure/repositories/TargetViewsKnex.repository');
const EdsProfileKnexRepository = require('infrastructure/repositories/EdsProfileKnex.repository');
const EdsServicesAccountKnexRepository = require('infrastructure/repositories/EdsServicesProfileKnex.repository');
const PollsAnswersKnexRepository = require('infrastructure/repositories/PollsAnswersKnex.repository');
const ResidentIndicationsRepository = require('infrastructure/repositories/ResidentIndicationsKnex.repository');
const LoyaltyHistoryKnexRepository = require('infrastructure/repositories/LoyaltyHistoryKnex.repository');
const LoyaltyInvitationsKnexRepository = require('infrastructure/repositories/LoyaltyInvitationsKnex.repository');
const LoyaltyOperationsKnexRepository = require('infrastructure/repositories/LoyaltyOperationsKnex.repository');
const VacanciesResponsesKnexRepository = require('infrastructure/repositories/VacanciesResponsesKnex.repository');
const ServiceKnexRepository = require('infrastructure/repositories/ServiceKnex.repository');

function buildsDependencies() {
  const dependencies = Object.freeze({
    nedolzhnikExternal,
    uppOrnExternal,
    smsExternal,
    emailExternal,
    dadataExternal,
    cmsExternal,
    edsExternal,
    edsServicesExternal,
    yandexS3External,
    managingCompanyExternal,
    managingCompanyExternalMock,
    reformaZhkhExternal,

    jwtTokenManager,
    hashManager,
    pushManager: new PushManager(),
    loyaltyManager,

    userRepository: new UserObjectionRepository(),
    residentProfileRepository: new ResidentProfileObjectionRepository(),
    confirmationTokenRepository: ConfirmationTokenKnexRepository,
    refreshTokenRepository: RefreshTokenKnexRepository,
    userNotificationTokensRepository: UserNotificationTokensRepository,
    notificationRepository: NotificationRepository,
    userNotificationsRepository: new UserNotificationsRepository(),
    targetRateRepository: TargetRateKnexRepository,
    targetViewsRepository: TargetViewsKnexRepository,
    edsProfileRepository: EdsProfileKnexRepository,
    edsServicesProfileRepository: EdsServicesAccountKnexRepository,
    pollsAnswersRepository: PollsAnswersKnexRepository,
    residentIndicationsRepository: ResidentIndicationsRepository,
    loyaltyHistoryRepository: LoyaltyHistoryKnexRepository,
    loyaltyInvitationsRepository: LoyaltyInvitationsKnexRepository,
    loyaltyOperationsRepository: LoyaltyOperationsKnexRepository,
    vacanciesResponsesRepository: VacanciesResponsesKnexRepository,
    serviceRepository: ServiceKnexRepository,

    logger: pino(),
  });

  return dependencies;
}

module.exports = buildsDependencies();
