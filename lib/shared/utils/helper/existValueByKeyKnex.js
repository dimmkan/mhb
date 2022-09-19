const existValueByKey = (Model) => (key, value) => Model
  .query()
  .select(key)
  .where(key, value)
  .limit(1)
  .first()
  .then((result) => result && result[key] !== null);

module.exports = existValueByKey;
