const _ = require('ramda');

const schemaBody = (body, description) => ({
  type: 'object',
  description: description || body.description,
  properties: Object
    .entries(body)
    .reduce(
      (acc, [key, value]) => {
        acc[key] = {
          type: Array.isArray(value) ? 'array' : typeof value,
          example: value,
        };
        return acc;
      },
      {},
    ),
}
);

/**
 * openapiResponseError(
 * [errorCodes.VALIDATION, { description: 'Описание', additional: { meta: [] } }],
 *  ...
 * );
 *
 * openapiResponseError(errorCodes.BAD_REQUEST, errorCodes.BAD_RESIDENT_ID);
 */
const openapiResponseError = _.unapply(_.compose(
  _.map(_.ifElse(_.propSatisfies(_.gt(_.__, 1), 'length'), _.objOf('oneOf'), _.head)),
  (arr) => arr.reduce(
    (acc, item) => {
      const [body, opts] = Array.isArray(item) ? item : [item, { description: item.description }];

      acc[body.status] = acc[body.status] || [];
      acc[body.status].push(schemaBody({ ...body, ...opts.additional }, opts.description));
      return acc;
    },
    {},
  ),
));

module.exports = openapiResponseError;
