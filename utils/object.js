'use strict';

function getSuperClass(obj) {
  if (typeof obj === 'function') {
    return Object.getPrototypeOf(obj.prototype).constructor;
  }
  const p = Object.getPrototypeOf(Object.getPrototypeOf(obj));
  if (!p) {
    return null;
  }
  return p.constructor;
}

function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}

module.exports = {
  getSuperClass,
  isPlainObject,
};
