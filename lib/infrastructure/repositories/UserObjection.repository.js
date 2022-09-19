/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */

const { transaction } = require('objection');
const first = require('shared/utils/helper/first');
const UserModel = require('infrastructure/orm/objection/models/UserObjection.model');
const UserProfileModel = require('infrastructure/orm/objection/models/UserProfileObjection.model');
const existValueByKey = require('shared/utils/helper/existValueByKeyKnex');

const selectFieldsWithGraph = (key, relationKey) => (
  (query, fieldOpts) => {
    if (!fieldOpts) return query;
    if (fieldOpts[key]) query.select(fieldOpts[key]);
    if (fieldOpts[relationKey]) {
      query.withGraphFetched(relationKey);
      if (typeof fieldOpts[relationKey] !== 'boolean') {
        query.modifyGraph(
          relationKey,
          (b) => b.select(fieldOpts[relationKey]),
        );
      }
    }
    return query;
  }
);

class UserRepository {
  constructor() {
    this.transaction = transaction;
    this.userProfileFieldsHelper = selectFieldsWithGraph('user', 'profile');
    this.existInUser = existValueByKey(UserModel);
  }

  persist(domainUserWithProfile, { trx } = {}) {
    return UserModel.query(trx).insertGraph(domainUserWithProfile);
  }

  get(id, fieldOpts) {
    return this.userProfileFieldsHelper(
      UserModel.query().where('id', id).limit(1).first(),
      fieldOpts,
    );
  }

  getByPhone(phone) {
    return UserModel.query()
      .where('phone', phone)
      .limit(1)
      .first();
  }

  getByEmail(email) {
    return UserModel.query()
      .where('email', email)
      .limit(1)
      .first();
  }

  remove(id, { trx } = {}) {
    return UserModel.query(trx)
      .del()
      .where('id', id);
  }

  merge(domainUser, { trx } = {}) {
    return UserModel.query(trx)
      .update(domainUser)
      .where('id', domainUser.id)
      .returning('*')
      .then(first);
  }

  mergeProfile(domainProfile, { trx } = {}) {
    return UserProfileModel.query(trx)
      .update(domainProfile)
      .where('userId', domainProfile.userId)
      .returning('*')
      .then(first);
  }

  phoneExist(phone) {
    return this.existInUser('phone', phone);
  }

  emailExist(email) {
    return this.existInUser('email', email);
  }

  getFilteredUsersList(filters) {
    return UserModel.query()
      .select(['users.id',
        'users.phone',
        'users.email',
        'users.confirmed',
        'user_profile.full_name as full_name',
        'user_profile.sex',
        'user_profile.birthday',
        'resident_profile.resident_id as resident_id',
        'resident_account.managing_company_id as managing_company_id',
        'address.result as user_address',
        'users.created_at as date_created',
        'users.updated_at as date_updated'])
      .leftJoin('user_profile as user_profile', 'users.id', 'user_profile.user_id')
      .leftJoin('resident_profile as resident_profile', 'users.id', 'resident_profile.user_id')
      .leftJoin('resident_account as resident_account', 'resident_profile.resident_id', 'resident_account.resident_id')
      .leftJoin('address', 'resident_account.address_id', 'address.id')
      .modify((queryBuilder) => {
        if (filters.length) {
          const firstCondition = filters.shift();
          queryBuilder.where(firstCondition.field, firstCondition.condition, firstCondition.value);
          filters.forEach((item) => {
            queryBuilder.andWhere(item.field, item.condition, item.value);
          });
        }
      })
      .orderBy('users.id');
  }
}

module.exports = UserRepository;
