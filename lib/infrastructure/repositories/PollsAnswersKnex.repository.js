const _ = require('ramda');
const isEmptyOrNull = require('shared/utils/helper/isEmptyOrNull');
const first = require('shared/utils/helper/first');
const { knex } = require('../db/knex');

const Table = () => knex('polls_answers');

module.exports = {
  persist: (data) => Table()
    .insert(data)
    .returning('*')
    .then(first),

  getPollResults: (pollId) => Table()
    .select('answer')
    .count('answer as count')
    .where('poll_id', pollId)
    .groupBy('answer'),

  getPollParticipantsAnswers: (pollId) => Table()
    .select(
      knex.raw('string_agg(polls_answers.answer::character varying, \',\') as answer,address.source,address.result,CAST(polls_answers.created_at as DATE) as date'),
    )
    .modify((queryBuilder) => {
      queryBuilder.leftJoin(
        'resident_account',
        'resident_account.resident_id',
        '=',
        'polls_answers.resident_id',
      );
      queryBuilder.innerJoin(
        'address',
        'resident_account.address_id',
        'address.id',
      );
    })
    .where('polls_answers.poll_id', '=', pollId)
    .groupBy(
      'polls_answers.poll_id',
      'address.source',
      'address.result',
      'polls_answers.user_id',
      'polls_answers.resident_id',
    )
    .groupByRaw('date'),

  findByUserIdAndResidentId: (userId, residentId, pollId = null) => {
    const builder = Table()
      .select('*')
      .where('userId', userId)
      .where('residentId', residentId);

    if (isEmptyOrNull(pollId)) return builder;

    if (Array.isArray(pollId)) {
      builder.whereIn('pollId', pollId);
    } else {
      builder.where('pollId', pollId);
    }

    return builder;
  },
};
