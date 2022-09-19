const { AppError, errorCodes } = require('shared/errors');
const notificationEnum = require('shared/utils/helper/notificationTypesEnumerate');

const findManagingCompanyId = async (dependencies, residentId) => {
  try {
    const { residentProfileRepository, nedolzhnikExternal, managingCompanyExternal } = dependencies;

    const exist = await residentProfileRepository.findManagingCompanyByResidentId(residentId);
    if (exist) return exist.managingCompanyId;
    const { name: nId } = await nedolzhnikExternal.getManagingCompany(residentId);
    const company = await managingCompanyExternal.getByNId(nId.replace(/("|')/g, ''), { fields: 'id' });
    return company.id;
  } catch (e) {
    throw new AppError(errorCodes.BAD_REQUEST, { description: 'Managing company not found', descriptionRu: 'Управляющая компания не найдена' });
  }
};

const findAddress = async (dependencies, residentId) => {
  const { residentProfileRepository, nedolzhnikExternal, dadataExternal } = dependencies;

  const addressData = await nedolzhnikExternal.getAddress(residentId);
  const source = addressData.address.toLowerCase().replace(/(_)/g, '');
  const exist = await residentProfileRepository.findAddressBySource(source, { fields: 'id' });
  return exist || dadataExternal.cleanAddress(source).catch(() => ({ source, qc: 9 }));
};

const notify = async (
  dependencies,
  {
    ownerUserId, userId, id, residentId,
  },
) => {
  const { pushManager, userRepository } = dependencies;

  const { profile: { fullName } } = await userRepository.get(userId, {
    profile: ['fullName'],
  });

  const sendData = {
    userId: ownerUserId,
    type: notificationEnum.CONFIRM_USER_NOTIFICATION,
    residentProfileId: id,
    fullName,
    residentId,
  };
  await pushManager.sendToUser(dependencies, sendData);
};

module.exports = async function createResidentProfile(
  dependencies,
  { residentId, userId },
) {
  const { residentProfileRepository } = dependencies;
  if (await residentProfileRepository.residentIdExist(residentId)) {
    const ownerProfile = await residentProfileRepository.findParentByResidentId(residentId);

    const residentProfile = await residentProfileRepository.persist({
      ...ownerProfile
        ? { parentId: ownerProfile.id, confirmed: false }
        : { parentId: null, confirmed: true },
      userId,
      residentId,
    });

    // Генерация и отправка оповещения главному пользователю
    if (ownerProfile) {
      await notify(dependencies, {
        userId,
        ownerUserId: ownerProfile.userId,
        id: residentProfile.id,
        residentId,
      });
    }

    return residentProfile;
  }

  const managingCompanyId = await findManagingCompanyId(dependencies, residentId);
  const address = await findAddress(dependencies, residentId);

  return residentProfileRepository.persist({
    parentId: null,
    confirmed: true,
    userId,
    residentAccount: { residentId, managingCompanyId, address },
  });
};
