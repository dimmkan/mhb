module.exports = function format(str, ...args) {
  let s = str;
  let i = args.length;
  // eslint-disable-next-line no-plusplus
  while (i--) {
    // eslint-disable-next-line prefer-rest-params
    s = s.replace(new RegExp(`\\{${i}\\}`, 'gm'), args[i]);
  }
  return s;
};
