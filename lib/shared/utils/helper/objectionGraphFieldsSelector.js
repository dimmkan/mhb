const objectionGraphFieldsSelector = (query, fields) => {
  if (Array.isArray(fields)) return query.select(fields);
  const tableName = query.tableName();
  if (fields[tableName]) { query.select(fields[tableName]); }
  const keys = Object.keys(fields).filter((t) => t !== tableName);
  query.withGraphFetched(keys.length === 1 ? keys[0] : `[${keys.join(',')}]`);
  keys.forEach((k) => query.modifyGraph(k, (b) => b.select(fields[k])));
  return query;
};

module.exports = objectionGraphFieldsSelector;
