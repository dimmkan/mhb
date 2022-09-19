const { curry } = require('ramda');

const convergeP = curry(async (after, fns, arg) => {
  const input = await arg;
  return Promise.all(fns
    .map((fn) => fn(input)))
    .then((r) => after(...r));
});

module.exports = convergeP;
