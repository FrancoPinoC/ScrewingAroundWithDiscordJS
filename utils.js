// random int from min (inclusive) to max (inclusive)
modules.exports.getRandomInt = (min, max) => {
  // not checking that min<max because just use it right, damn it.
  return min + Math.floor(Math.random() * ((max-min)+1));
};