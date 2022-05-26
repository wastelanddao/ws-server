'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
// const Villager = require('../villager');

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

  static getContractAddress() {
    return 'building';
  }
  async mint(owner) {
    const { type, subType } = this;
    const metaData = { type, subType };
    const tokenId = await Building.mint721(owner, metaData);
    this.tokenId = tokenId;
    this.name = this.name || `${subType}#${tokenId}`;
    return tokenId;
  }

  static async findByPlayerId(playerId, {
    type,
    subType,
  } = {}) {
    const filter = {};
    if (type) {
      filter.type = type;
    }
    if (subType) {
      filter.subType = subType;
    }
    const arr = await super.findByPlayerId(playerId, {
      filter,
    });
    return arr;
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
  subType: Joi.valid('Hut', 'Hall', 'Warehouse', 'Portal', 'Farm', 'Mill', 'Bakery', 'Swine Farm', 'Butcher\'s', 'Bonfire'),
  status: Joi.valid('WORKING', 'INUSE', 'INSTOCK'),
  villagers: Joi.number().integer().min(0),
  location: Joi.number().integer(),
};
Moralis.Object.registerSubclass('Building', Building);
module.exports = Building;
