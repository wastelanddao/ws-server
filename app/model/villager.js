'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
// const Player = require('./player');
// const Activity = require('./activity');
// const Item = require('./base/item');
// const Base = require('./base/base');

class Villager extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Villager');
  }

  async mint(owner) {
    const { gender, birthTime, strength, luck, endurance, traits } = this;
    const metaData = { gender, birthTime, strength, luck, endurance, traits };
    const tokenId = await Villager.mint721(owner, metaData);
    this.tokenId = tokenId;
    return tokenId;
  }
  static create({
    name = '',
    gender = 'MALE',
    birthTime = 0,
    strength = 25,
    luck = 25,
    endurance = 25,
    inScene = false,
    activity = [],
    traits = {
      eye: 0,
      eyebrow: 0,
      ear: 0,
      nose: 0,
      mouth: 0,
    },
    carriage = [],
    tradable = true,
  } = {}) {
    const v = new Villager();
    v.name = name;
    v.gender = gender;
    v.birthTime = birthTime;
    v.strength = strength;
    v.luck = luck;
    v.endurance = endurance;
    v.inScene = inScene;
    v.activity = activity;
    v.traits = traits;
    v.carriage = carriage;
    v.tradable = tradable;
    return v;
  }
  static getContractAddress() {
    return 'villager';
  }
  static async findById(id) {
    const query = this.query();
    query.equalTo('objectId', id).include('activity');
    return await query.first({ useMasterKey: true });
  }
  static async findOwnById(id, playerId) {
    const [ v ] = await this.findByPlayerId(playerId, {
      includes: [ 'activity', 'carriage' ],
      filter: {
        objectId: id,
      },
    });
    return v;
  }
  get name() { return this.get('name'); }
  set name(attr) { return this.set('name', attr); }

  get gender() { return this.get('gender'); }
  set gender(attr) { return this.set('gender', attr); }

  get birthTime() { return this.get('birthTime'); }
  set birthTime(attr) { return this.set('birthTime', attr); }

  get strength() { return this.get('strength'); }
  set strength(attr) { return this.set('strength', attr); }

  get luck() { return this.get('luck'); }
  set luck(attr) { return this.set('luck', attr); }

  get endurance() { return this.get('endurance'); }
  set endurance(attr) { return this.set('endurance', attr); }

  get inScene() { return this.get('inScene'); }
  set inScene(attr) { return this.set('inScene', attr); }

  get activity() { return this.get('activity'); }
  set activity(attr) { return this.set('activity', attr); }

  get traits() { return this.get('traits'); }
  set traits(attr) { return this.set('traits', attr); }

  get carriage() { return this.get('carriage'); }
  set carriage(attr) { return this.set('carriage', attr); }

  get happiness() { return this.get('happiness'); }
  set happiness(attr) { return this.set('happiness', attr); }

  get fatherId() { return this.get('fatherId'); }
  set fatherId(attr) { return this.set('fatherId', attr); }

  get motherId() { return this.get('motherId'); }
  set motherId(attr) { return this.set('motherId', attr); }

  // 是否成年
  get isAdult() {
    return (new Date() - new Date(this.birthTime)) > 15 * 24 * 3600 * 1000;
  }
  get realLuck() {
    const scale = this.isAdult ? 1 : 0.3;
    let ret = this.luck * scale;
    for (const item of this.carriage) {
      if (item.luck === undefined) {
        throw new Error('data error');
      }
      ret += item.luck;
    }
    return ret;
  }
  get realStrength() {
    const scale = this.isAdult ? 1 : 0.3;
    let ret = this.strength * scale;
    for (const item of this.carriage) {
      if (item.strength === undefined) {
        throw new Error('data error');
      }
      ret += item.strength;
    }
    return ret;
  }
  get realEndurance() {
    const scale = this.isAdult ? 1 : 0.3;
    let ret = this.endurance * scale;
    for (const item of this.carriage) {
      if (item.endurance === undefined) {
        throw new Error('data error');
      }
      ret += item.endurance;
    }
    return ret;
  }

}

Villager.schema = {
  name: Joi.string().allow(''),
  fatherId: Joi.string(),
  motherId: Joi.string(),
  gender: Joi.valid('MALE', 'FEMALE'),
  birthTime: Joi.date(),
  strength: Joi.number().integer(),
  luck: Joi.number().integer(),
  endurance: Joi.number().integer(),
  inScene: Joi.bool(),
  activity: Joi.array().items(Joi.object().instance(Moralis.Object)),
  traits: Joi.object({
    eye: Joi.number().integer(),
    eyebrow: Joi.number().integer(),
    ear: Joi.number().integer(),
    nose: Joi.number().integer(),
    mouth: Joi.number().integer(),
  }),
  carriage: Joi.array().items(Joi.object().instance(Moralis.Object)),
  tradable: Joi.bool(),
  happiness: Joi.number().integer(),
};
Moralis.Object.registerSubclass('Villager', Villager);
module.exports = Villager;
