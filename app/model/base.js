'use strict';
const Moralis = require('moralis/node');


class BaseObject extends Moralis.Object {
  // eslint-disable-next-line no-useless-constructor
  constructor(attr) {
    // Pass the ClassName to the Moralis.Object constructor
    super(attr);
  }
  toPlain() {
    return moralisObjToPlain(this);
  }
}
// 只是一个基类，不存数据表
module.exports = BaseObject;


function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}

function moralisObjToPlain(obj) {
  let ret;
  if (obj instanceof Moralis.Object) {
    // moralis object
    ret = {
      id: obj.id,
    };
    const { attributes } = obj;
    for (const key of Object.keys(attributes)) {
      const attr = attributes[key];
      ret[key] = moralisObjToPlain(attr);
    }
    return ret;
  } else if (Array.isArray(obj)) {
    // array
    return obj.map(o => moralisObjToPlain(o));
  } else if (isPlainObject(obj)) {
    // plain object
    ret = {};
    for (const key of Object.keys(obj)) {
      const attr = obj[key];
      ret[key] = moralisObjToPlain(attr);
    }
    return ret;
  }
  // other
  return obj;
}
