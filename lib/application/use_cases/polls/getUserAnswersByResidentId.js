const _ = require('ramda');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');

const getUserAnswersByResidentId = async (
  { pollsAnswersRepository },
  userId,
  residentId,
  pollIds,
) => {
  const answers = await pollsAnswersRepository.findByUserIdAndResidentId(
    userId,
    residentId,
    !isEmptyOrNull(pollIds)
      ? pollIds.split(',')
      : null,
  );

  return {
    data: _.compose(
      _.map(
        _.applySpec({
          id: _.compose(_.prop('pollId'), _.nth(0)),
          answers: _.map(_.prop('answer')),
        }),
      ),
      _.values,
      _.groupBy(_.prop('pollId')),
    )(answers),
  };
};

module.exports = getUserAnswersByResidentId;
