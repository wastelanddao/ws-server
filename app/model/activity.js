'use strict';
const Base = require('./base/base');
const Joi = require('joi');
const Moralis = require('moralis/node');
const Villager = require('./villager');

class Activity extends Base {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Activity');
  }
  get type() {
    return this.get('type');
  }
  set type(attr) {
    return this.set('type', attr);
  }
  get startTime() {
    return this.get('startTime');
  }
  set startTime(attr) {
    return this.set('startTime', attr);
  }
  get dueTime() {
    return this.get('dueTime');
  }
  set dueTime(attr) {
    return this.set('dueTime', attr);
  }
  get villagerId() {
    return this.get('villagerId');
  }
  set villagerId(attr) {
    return this.set('villagerId', attr);
  }
  get status() {
    return this.get('status');
  }
  set status(attr) {
    return this.set('status', attr);
  }
  get playerId() { return this.get('playerId'); }
  set playerId(attr) { return this.set('playerId', attr); }

  get extraInfo() { return this.get('extraInfo'); }
  set extraInfo(attr) { return this.set('extraInfo', attr); }

  async finish(speedUp = false) {
    if (!speedUp && this.dueTime > new Date()) {
      throw new Error('still on going');
    }
    const villager = Villager.findById(this.villagerId);
    // activity数组中只保留进行中的
    villager.activity = villager.activity.filter(act => act.id !== this.id && act.status !== 'ENDED');
    this.status = 'ENDED';
    await Promise.all([
      this.save(),
      villager.save(),
    ]);
  }

  static async findByPlayerId(playerId) {
    const query = this.query();
    query.equalTo('playerId', playerId);
    const os = await query.find({ useMasterKey: true });
    return os;
  }
}

Activity.schema = {
  type: Joi.valid('Idle', 'Hunting', 'Exploring', 'Picking Fruits', 'Pregnant'),
  startTime: Joi.date(),
  dueTime: Joi.date(),
  villagerId: Joi.string(),
  playerId: Joi.string(),
  status: Joi.valid('STARTED', 'ENDED'),
  extraInfo: Joi.object(),
  // 收获
  chests: Joi.array().items(Joi.object().instance(Moralis.Object)),
  items: Joi.array().items(Joi.object().instance(Moralis.Object)),
};

Moralis.Object.registerSubclass('Activity', Activity);
module.exports = Activity;
