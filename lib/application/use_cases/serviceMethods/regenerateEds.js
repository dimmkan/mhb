const createEdsProfile = require('application/use_cases/eds/createEdsProfile');
const createEdsServicesProfile = require('application/use_cases/edsServices/createProfile');
const getResidentProfileAddress = require('application/use_cases/serviceMethods/getResidentProfileAddress');
const _ = require('ramda');

const regenerateEds = async (serviceLocator) => {
  const {
    serviceRepository,
    residentProfileRepository,
  } = serviceLocator;

  const allUsers = await serviceRepository.getUserList();

  allUsers.forEach(async (user) => {
    const residentId = await residentProfileRepository.findAllByUserIdWithoutAddress(user.id).then(
      _.compose(
        _.prop('residentId'),
        _.head,
      ),
    );
    const address = residentId ? await getResidentProfileAddress(serviceLocator, residentId) : '';
    await Promise.allSettled([
      createEdsProfile(serviceLocator, { userId: user.id, ..._.omit(['id'], user), address }),
      createEdsServicesProfile(serviceLocator, { userId: user.id, ..._.omit(['id'], user), address }),
    ]);
  });
};

module.exports = regenerateEds;
