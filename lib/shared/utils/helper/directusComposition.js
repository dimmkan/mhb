const _ = require('ramda');

function sanitizeFields(rawFields) {
  if (!rawFields) { return ''; }
  let fields = [];
  if (typeof rawFields === 'string') {
    fields = rawFields.split(',');
  } else if (Array.isArray(rawFields)) { fields = rawFields; }
  fields = _.flatten(fields.map((field) => (field.includes(',') ? field.split(',') : field)));
  fields = fields.map((field) => field.trim());
  return [...new Set(fields)];
}

const groupFields = _.compose(
  _.map(_.pluck('attribute')),
  _.groupBy(_.prop('field')),
);

function matchOutsideFields(triggerFields, queryFields) {
  if (!(queryFields && queryFields.length)) return [];

  if (queryFields.indexOf('*.*') !== -1) {
    return triggerFields.map((field) => ({ field }));
  }

  const matched = [];
  queryFields.forEach((raw) => {
    const [field, attribute] = raw.split('.');
    if (triggerFields.indexOf(field) !== -1) {
      matched.push({ field, attribute, raw });
    }
  });
  return matched;
}

function sanitizeQuery(rawQuery) {
  const query = { ...rawQuery };
  if (rawQuery.fields) {
    query.fields = sanitizeFields(rawQuery.fields);
  }
  return query;
}

const forceIdColumnToFields = (fields, idColumn) => (
  (fields.length && !fields.find((x) => x === idColumn || x === '*' || x === '*.*'))
    ? fields.concat(idColumn)
    : fields
);

const operationFields = (fields, needRemove) => fields
  .filter((field) => needRemove.indexOf(field) === -1);

/**
 * Get data from "operation" and merge (and/or) trace
 * @param {Function} operation Async Function to get data
 * @param {Object} fieldsOps Functions for receive data
 * @param {Object} opts options
 * @param {Array.<Function>} opts.idColumn operation identificator
 */
module.exports = (operation, fieldsOps, predicate, { idColumn = 'id' } = {}) => {
  const triggerFields = Object.keys(fieldsOps);

  return async (req) => {
    const cleanQuery = sanitizeQuery(req.query);
    const { params } = req;
    const matchedFields = matchOutsideFields(triggerFields, cleanQuery.fields);

    if (!matchedFields.length) {
      return operation({ params, query: cleanQuery });
    }

    const fields = operationFields(
      cleanQuery.fields,
      matchedFields.flat(1).map((i) => i.raw),
    );

    const result = await operation({
      params,
      query: {
        ...cleanQuery,
        fields: forceIdColumnToFields(fields, idColumn),
      },
    });

    const predicatesData = await Promise.all(
      Object
        .entries(groupFields(matchedFields))
        .map(([field, attributes]) => fieldsOps[field]({ result, attributes, req })),
    );

    return predicate({
      result,
      fields: _.zipObj(_.pluck('field', matchedFields), predicatesData),
    });
  };
};
