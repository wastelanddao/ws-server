'use strict';
const Base = require('./base/base');
const Joi = require('joi');
const Moralis = require('moralis/node');

class Production extends Base {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Production');
  }

  get startTime() { return this.get('startTime'); }
  set startTime(attr) { return this.set('startTime', attr); }

  get dueTime() { return this.get('dueTime'); }
  set dueTime(attr) { return this.set('dueTime', attr); }

  get workplaceId() { return this.get('workplaceId'); }
  set workplaceId(attr) { return this.set('workplaceId', attr); }

  get status() { return this.get('status'); }
  set status(attr) { return this.set('status', attr); }

  get playerId() { return this.get('playerId'); }
  set playerId(attr) { return this.set('playerId', attr); }

  static async findByPlayerId(playerId, filter) {
    const os = await this.findByEqual({
      ...filter,
      playerId,
    });
    return os;
  }
}

Production.schema = {
  startTime: Joi.date(),
  dueTime: Joi.date(),
  workplaceId: Joi.string(),
  playerId: Joi.string(),
  status: Joi.valid('STARTED', 'ENDED'),
};

Moralis.Object.registerSubclass('Production', Production);
module.exports = Production;
