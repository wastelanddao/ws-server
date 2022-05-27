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
  randomRangInt([ start, end ]) {
    if (end < start) {
      throw new Error('end shoud bigger than start');
    }
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error('start and end should be integer');
    }
    return parseInt(start + Math.random() * (end + 1 - start));
  },
  randomSelect(arr) {
    if (!arr.length) {
      throw new Error('should not be empty');
    }
    const idx = this.randomRangInt([ 0, arr.length - 1 ]);
    return arr[idx];
  },
  randomSelectWithRatio(arr, ratioArr) {
    if (!arr.length) {
      throw new Error('should not be empty');
    }
    if (arr.length !== ratioArr.length) {
      throw new Error('length should equal');
    }
    let cnt = 10;
    while (cnt > 0) {
      for (const idx in ratioArr) {
        const ratio = ratioArr[idx];
        if (this.randomBool(ratio)) {
          return arr[idx];
        }
      }
      cnt -= 1;
    }
    // 循环10次还没中,那就随机取一个
    return this.randomSelect(arr);
  },
  joinUint(width, ...ints) {
    let strJoin = '';
    for (const i of ints) {
      if (!Number.isInteger(i)) {
        throw new Error('should be integer');
      }
      let b = i.toString(2);
      if (b.length > width) {
        throw new Error('width exceeded');
      }
      // 高位补0
      const cnt = width - b.length;
      for (let index = 0; index < cnt; index++) {
        b = '0' + b;
      }
      strJoin += b;
    }
    return parseInt(strJoin, 2);
  },
};
