'use strict';
const Joi = require('joi');
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');

class Chest extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Chest');
  }
  get playerId() { return this.get('playerId'); }
  set playerId(attr) { return this.set('playerId', attr); }

  get color() { return this.get('color'); }
  set color(attr) { return this.set('color', attr); }

  get opened() { return this.get('opened'); }
  set opened(attr) { return this.set('opened', attr); }

  get items() { return this.get('items'); }
  set items(attr) { return this.set('items', attr); }

  get activityId() {
    return this.get('activityId');
  }
  set activityId(attr) {
    return this.set('activityId', attr);
  }

  static async findByActivityId(actId) {
    const query = this.query();
    query.equalTo('activityId', actId);
    query.include('items');
    return await query.find({ useMasterKey: true });
  }
}

Chest.schema = {
  playerId: Joi.string(),
  color: Joi.valid('GREEN', 'ORANGE', 'GRAY', 'GREEN'),
  opened: Joi.bool(),
  items: Joi.array().items(Joi.object().instance(Moralis.Object)),
  activityId: Joi.string(),
};

Moralis.Object.registerSubclass('Chest', Chest);
module.exports = Chest;
