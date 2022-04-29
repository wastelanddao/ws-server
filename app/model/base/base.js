'use strict';
const Moralis = require('moralis/node');
const Joi = require('joi');
const { getSuperClass, isPlainObject } = require('../../../utils');
class BaseObject extends Moralis.Object {
  // constructor(attr) {
  //   // Pass the ClassName to the Moralis.Object constructor
  //   super(attr);
  // }
  static async query() {
    return Moralis.query();
  }
  toPlain() {
    return moralisObjToPlain(this);
  }
  toJson() {
    return this.toPlain();
  }

  // 此方法尽量不要重载
  async validateSchema() {
    let cls = this.constructor;
    let schema = cls.schema || {};
    while (cls !== BaseObject) {
      cls = getSuperClass(cls);
      schema = Object.assign(cls.schema, schema);
    }
    return Joi.object(schema).validateAsync(this.attributes);
  }
  // 此方法尽量不要重载
  async save() {
    await this.validateSchema();
    await super.save();
  }
}

BaseObject.schema = {
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};

module.exports = BaseObject;

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
