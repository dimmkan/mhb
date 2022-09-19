module.exports = (table) => `CREATE OR REPLACE TRIGGER set_timestamp_${table}
BEFORE
UPDATE ON ${table}
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();`;
