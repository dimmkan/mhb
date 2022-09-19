const { errorCodes, AppError } = require('shared/errors');

const deleteUser = async (serviceLocator, { userId }) => {
  const {
    residentProfileRepository,
    userRepository,
    cmsExternal,
  } = serviceLocator;

  const childrenProfiles = await residentProfileRepository.findChildrensProfilesByUserId(userId);

  childrenProfiles.forEach((item) => {
    if (item.children.length) throw new AppError(errorCodes.HAS_SECOND_USER, { descriptionRu: 'По вашим лицевым счетам имеются дополнительные пользователи в разделе “Все пользователи”. Удаление учетной записи невозможно.' });
  });

  try {
    const residentProfiles = await residentProfileRepository.findAllByUserIdWithAddress(userId);
    await residentProfileRepository.removeMany(residentProfiles.map((item) => item.id));

    await userRepository.remove(userId);

    await Promise.allSettled([
      cmsExternal.deleteUserAvatar({ userId }),
      cmsExternal.deleteUserPassport({ userId }),
      cmsExternal.deleteUserIndications({ userId }),
      cmsExternal.deleteUserEdsProfileAdd({ userId }),
      cmsExternal.deleteUserEdsServicesProfileAdd({ userId }),
    ]);
  } catch (e) {
    throw new AppError(errorCodes.INTERNAL_SERVER_ERROR, { descriptionRu: 'Ошибка сервера. Повторите попытку позже.' });
  }
};

module.exports = deleteUser;
