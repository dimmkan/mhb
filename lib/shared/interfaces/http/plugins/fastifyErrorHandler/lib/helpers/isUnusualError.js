module.exports = (status) => [400, 401, 403, 404, 422].indexOf(status) === -1;
