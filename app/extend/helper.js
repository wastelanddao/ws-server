'use strict';

const utils = require('../../utils');
module.exports = {
  isPlainObject: utils.isPlainObject,
  // 把小数次数变成整数次数，随机加1或加0
  randomTimes(times) {
    const timesInt = parseInt(times);
    const timesAdd = Math.random() < times - timesInt ? 1 : 0;
    return timesInt + timesAdd;
  },
  randomBool(probability) {
    probability = Number(probability);
    if (Number.isNaN(probability)) {
      throw new Error('probability not a number');
    }
    return Math.random() < probability;
  },
};
