const multipartToKeyValue = require('shared/utils/helper/multipartToKeyValue');
const vacancyResponse = require('application/use_cases/vacancies/vacancyResponse');

async function vacancyResponseHandler(req, reply) {
  const result = await vacancyResponse(
    this.serviceLocator,
    {
      ...multipartToKeyValue(req.body),
      files: req.body.files,
      userId: (req.isAuth && req.authCredentials.id),
      vacancyId: req.params.vacancyId,
    },
  );

  return result ? reply.code(200).send(result) : reply.code(204).send();
}

module.exports = {
  vacancyResponseHandler,
};
