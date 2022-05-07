'use strict';
const Asset = require('./asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
const Villager = require('../villager');

class Building extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Building');
  }

  get type() { return this.get('type'); }
  set type(val) { return this.set('type', val); }

  get subType() { return this.get('subType'); }
  set subType(val) { return this.set('subType', val); }

  get status() { return this.get('status'); }
  set status(val) { return this.set('status', val); }

  get villagers() { return this.get('villagers'); }
  set villagers(val) { return this.set('villagers', val); }

  get location() { return this.get('location'); }
  set location(val) { return this.set('location', val); }

  static async findByPlayerId(playerId, {
    type,
    subType,
  } = {}) {
    const query = this.query();
    query.equalTo('playerId', playerId);
    if (type) {
      query.equalTo('type', type);
    }
    if (subType) {
      query.equalTo('subType', subType);
    }
    const buildings = await query.find({ useMasterKey: true });
    return buildings;
  }

  // 强制类型转换
  static convertType(building, cls) {
    if (building.constructor !== Building) {
      throw new TypeError('must be instance of building');
    }
    const Cls = cls || this;
    building.constructor = Cls;
    // eslint-disable-next-line no-proto
    building.__proto__ = Cls.prototype;
    return building;
  }
}

Building.schema = {
  type: Joi.valid('Hut', 'Hall', 'Warehouse', 'Portal', 'Workplace'),
  subType: Joi.valid('Hut', 'Hall', 'Warehouse', 'Portal', 'Farm', 'Mill', 'Bakery', 'Vineyard', 'Winery', 'Pig Farm', 'Sausage Shop', 'Rotisserie'),
  status: Joi.valid('WORKING', 'INUSE', 'INSTOCK'),
  villagers: Joi.array().items(Joi.object().instance(Villager)),
  location: Joi.number().integer(),
};
Moralis.Object.registerSubclass('Building', Building);
module.exports = Building;
