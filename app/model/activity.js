'use strict';
const Base = require('./base/base');
const Joi = require('joi');
const Moralis = require('moralis/node');
// const Villager = require('./villager');

class Activity extends Base {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Activity');
  }
  get type() { return this.get('type'); }
  set type(attr) { return this.set('type', attr); }

  get startTime() { return this.get('startTime'); }
  set startTime(attr) { return this.set('startTime', attr); }

  get dueTime() { return this.get('dueTime'); }
  set dueTime(attr) { return this.set('dueTime', attr); }

  get villagerId() { return this.get('villagerId'); }
  set villagerId(attr) { return this.set('villagerId', attr); }

  get status() { return this.get('status'); }
  set status(attr) { return this.set('status', attr); }

  get playerId() { return this.get('playerId'); }
  set playerId(attr) { return this.set('playerId', attr); }

  // 活动开始时的满意值
  get happiness() { return this.get('happiness'); }
  set happiness(attr) { return this.set('happiness', attr); }

  get extraInfo() { return this.get('extraInfo'); }
  set extraInfo(attr) { return this.set('extraInfo', attr); }

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
  happiness: Joi.number().integer(),
  extraInfo: Joi.object(),
};

Moralis.Object.registerSubclass('Activity', Activity);
module.exports = Activity;
