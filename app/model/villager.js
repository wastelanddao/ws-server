'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
// const Activity = require('./activity');
// const Item = require('./base/item');
// const Base = require('./base/base');

class Villager extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Villager');
  }
  static create({
    playerId,
    name = '',
    gender = 'MALE',
    birthTime = new Date().getTime(),
    strength = 25,
    luck = 25,
    endurance = 25,
    happiness = 10,
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
    if (!playerId) {
      throw new Error('need player id');
    }
    const v = new Villager();
    v.playerId = playerId;
    v.name = name;
    v.gender = gender;
    v.birthTime = birthTime;
    v.strength = strength;
    v.luck = luck;
    v.endurance = endurance;
    v.happiness = happiness;
    v.inScene = inScene;
    v.activity = activity;
    v.traits = traits;
    v.carriage = carriage;
    v.tradable = tradable;
    return v;
  }
  static async findByPlayerId(playerId) {
    return this.query().equalTo('playerId', playerId).include('activity')
      .find({ useMasterKey: true });
  }
  static async findById(id) {
    const query = this.query();
    query.equalTo('objectId', id).include('activity');
    return await query.first({ useMasterKey: true });
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

  get happiness() { return this.get('happiness'); }
  set happiness(attr) { return this.set('happiness', attr); }

  get inScene() { return this.get('inScene'); }
  set inScene(attr) { return this.set('inScene', attr); }

  get activity() { return this.get('activity'); }
  set activity(attr) { return this.set('activity', attr); }

  get traits() { return this.get('traits'); }
  set traits(attr) { return this.set('traits', attr); }

  get carriage() { return this.get('carriage'); }
  set carriage(attr) { return this.set('carriage', attr); }

  // 村民的实际属性 = 当前属性（基础属性+装备属性）* 满意值/100
  get realLuck() {
    return this.luck * (this.happiness || 10) / 100;
  }
  get realStrength() {
    return this.strength * (this.happiness || 10) / 100;
  }
  get realEndurance() {
    return this.endurance * (this.happiness || 10) / 100;
  }

}

Villager.schema = {
  name: Joi.string(),
  gender: Joi.valid('MALE', 'FEMALE'),
  birthTime: Joi.date(),
  strength: Joi.number().integer(),
  luck: Joi.number().integer(),
  endurance: Joi.number().integer(),
  happiness: Joi.number().integer(),
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
};
Moralis.Object.registerSubclass('Villager', Villager);
module.exports = Villager;
