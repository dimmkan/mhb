const retry = require('retry');

module.exports = (func, options, onFailedAttempt) => new Promise((resolve, reject) => {
  const op = retry.operation(options);
  op.attempt(async () => {
    try {
      resolve(await func());
    } catch (e) {
      if (onFailedAttempt) {
        e.attempts = op.attempts();
        onFailedAttempt(e);
      }
      if (!op.retry(e)) reject(e);
    }
  });
});
