// random int from min (inclusive) to max (inclusive)
let getRandomInt = (min, max) => {
  // not checking that min<max because just use it right, damn it.
  return min + Math.floor(Math.random() * ((max-min)+1));
};

module.exports.getRandomInt = (min, max) => {
  return getRandomInt(min, max);
};

module.exports.randoNoGood = () => {
  randoInt = getRandomInt(0,5);
  let noGoodList = [
    "🙅",
    "🙅🏻",
    "🙅🏼",
    "🙅🏽",
    "🙅🏾",
    "🙅🏿"
  ];
  return noGoodList[randoInt];
};