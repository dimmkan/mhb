const { AppError, errorCodes } = require('shared/errors');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const _ = require('ramda');

const ROLES_ENUM = Object.freeze({
  OWNER: 'OWNER', // Владелец ЛС
  USER: 'USER', // Пользователь профиля
});

function withRole(
  { residentProfileRepository },
  roles,
) {
  const accessRoles = Object.is(roles, ROLES_ENUM)
    ? Object.values(roles)
    : roles;

  if (isEmptyOrNull(accessRoles) || !Array.isArray(accessRoles)) {
    throw new Error(AppError(errorCodes.NO_ARGUMENT));
  }

  const hasAccess = (role) => {
    if (role && accessRoles.includes(role)) return true;
    throw new AppError(errorCodes.ACCESS);
  };

  const headProfile = (profile) => (profile.parentId !== null
    ? residentProfileRepository.get(profile.parentId)
    : profile);

  const belongsToUser = (userId) => _.whereEq({
    userId,
    confirmed: true,
  });

  return async function handler({ id, userId }) {
    const profile = await residentProfileRepository.get(id);
    const checkBelongs = belongsToUser(userId);

    const role = (
      (checkBelongs(profile) && ROLES_ENUM.USER)
      || (checkBelongs(await headProfile(profile)) && ROLES_ENUM.OWNER)
    );

    return hasAccess(role);
  };
}

module.exports = {
  withRole,
  roles: ROLES_ENUM,
};
