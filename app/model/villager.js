'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
const Activity = require('./activity');
// const Item = require('./base/item');
const Base = require('./base/base');

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

  async doActivity(act) {
    // const ongling = this.activity;
    // if (ongling.length > 0) {
    //   throw new Error('already on working');
    // }
    act.villagerId = this.id;
    act.playerId = this.playerId;
    console.log(this instanceof Villager);
    console.log(this.activity[0] instanceof Activity);
    console.log(this.activity[0] instanceof Base);
    console.log(this.activity[0] instanceof Moralis.Object);
    this.activity.push(act);
    await this.save();
    return act;
  }

  async doPicking() {
    const act = new Activity();
    act.type = 'Picking Fruits';
    const now = new Date();
    act.startTime = now;
    const { endurance } = this;
    let hours = 24;
    if (endurance > 20) {
      hours = 24 - (endurance - 20) / 20;
    }
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    return this.doActivity(act);
  }

  async doHunting() {
    const act = new Activity();
    act.type = 'Hunting';
    const now = new Date();
    act.startTime = now;
    const { endurance } = this;
    let hours = 24;
    if (endurance > 20) {
      hours = 24 - (endurance - 20) / 20;
    }
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    return this.doActivity(act);
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
