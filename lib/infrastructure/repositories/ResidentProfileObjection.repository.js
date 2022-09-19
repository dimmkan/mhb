/* eslint-disable class-methods-use-this */
const { transaction } = require('objection');
const _ = require('ramda');
const first = require('shared/utils/helper/first');
const objectionGraphFieldsSelector = require('shared/utils/helper/objectionGraphFieldsSelector');
const ResidentProfileModel = require('infrastructure/orm/objection/models/ResidentProfileObjection.model');
const ResidentAccountModel = require('infrastructure/orm/objection/models/ResidentAccountObjection.model');
const AddressModel = require('infrastructure/orm/objection/models/AddressObjection.model');
const throwIs = require('shared/utils/helper/throwIs');
const { AppError, errorCodes } = require('shared/errors');

const replaceAccountAddressToAddressId = _.when(
  _.pathSatisfies(_.is(Number), ['residentAccount', 'address', 'id']),
  _.over(
    _.lensProp('residentAccount'),
    _.converge(
      _.mergeRight,
      [
        _.omit(['address']),
        _.compose(_.objOf('addressId'), _.path(['address', 'id'])),
      ],
    ),
  ),
);

class ResidentProfileRepository {
  constructor() {
    this.transaction = transaction;
  }

  persist(domainResident, { trx } = {}) {
    return ResidentProfileModel.query(trx)
      .insertGraph(replaceAccountAddressToAddressId(domainResident))
      .catch((e) => {
        if (e.name === 'UniqueViolationError') {
          throw new AppError(errorCodes.DUPLICATE_CONFLICT, { origin: e });
        } throw new AppError(errorCodes.DB, { origin: e });
      });
  }

  get(id, { fields } = {}) {
    const query = ResidentProfileModel.query()
      .where('id', id)
      .limit(1)
      .first();
    return (fields ? objectionGraphFieldsSelector(query, fields) : query)
      .then(throwIs((x) => !x));
  }

  remove(id, { trx } = {}) {
    return ResidentProfileModel.query(trx)
      .del()
      .where('id', id);
  }

  removeMany(ids, { trx } = {}) {
    return ResidentProfileModel.query(trx)
      .del()
      .whereIn('id', ids);
  }

  merge(domainResident, { trx } = {}) {
    return ResidentProfileModel.query(trx)
      .update(domainResident)
      .where('id', domainResident.id)
      .returning('*')
      .then(first);
  }

  findParentByResidentId(residentId, { fields } = {}) {
    return ResidentProfileModel.query()
      .where({ residentId, parentId: null, confirmed: true })
      .select(fields || '*')
      .limit(1)
      .first();
  }

  findManagingCompanyByResidentId(residentId, { fields } = {}) {
    return ResidentAccountModel.query()
      .where('residentId', residentId)
      .select(fields || 'managingCompanyId')
      .limit(1)
      .first();
  }

  residentIdExist(residentId) {
    return ResidentAccountModel.query()
      .select('residentId')
      .where('residentId', residentId)
      .limit(1)
      .first()
      .then(_.is(ResidentAccountModel));
  }

  findAddressBySource(source, { fields } = {}) {
    return AddressModel.query()
      .where('source', source)
      .select(fields || '*')
      .limit(1)
      .first();
  }

  findByResidentIdAndUserId(residentId, userId) {
    return ResidentProfileModel.query()
      .where('userId', userId)
      .where('residentId', residentId)
      .where('confirmed', true)
      .withGraphFetched('residentAccount.address')
      .first();
  }

  findChildrens(id) {
    return ResidentProfileModel.query()
      .where('id', id)
      .withGraphFetched('children')
      .first()
      .then(_.prop('children'));
  }

  findChildrensProfilesByUserId(userId) {
    return ResidentProfileModel.query()
      .where('userId', userId)
      .select('residentId')
      .withGraphFetched('children.user.profile')
      .modifyGraph(
        'children',
        (b) => b
          .where('confirmed', true)
          .select(['id', 'userId']),
      );
  }

  findAllByUserIdWithAddress(userId) {
    return ResidentProfileModel.query()
      .where('userId', userId)
      .where('confirmed', true)
      .select(['id', 'confirmed', 'residentId'])
      .withGraphFetched('residentAccount.address');
  }

  findAllByManagingCompanyId(managingCompanyId) {
    return ResidentProfileModel.query()
      .where('confirmed', true)
      .select(['id', 'userId', 'confirmed'])
      .withGraphFetched('residentAccount.address')
      .modifyGraph(
        'residentAccount',
        (b) => b
          .select(['residentId', 'managingCompanyId'])
          .where('managingCompanyId', managingCompanyId),
      );
  }

  findAllByAddress(addressPayload) {
    return ResidentProfileModel.query()
      .where('confirmed', true)
      .select(['id', 'confirmed', 'userId'])
      .withGraphFetched('residentAccount.address')
      .modifyGraph(
        'residentAccount.address',
        (b) => b.where(addressPayload),
      );
  }

  findAllByUserIdWithoutAddress(userId) {
    return ResidentProfileModel.query()
      .where('userId', userId)
      .select(['id', 'confirmed', 'residentId']);
  }
}

module.exports = ResidentProfileRepository;
