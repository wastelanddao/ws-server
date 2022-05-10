'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');

class Chest extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Chest');
  }
  get color() { return this.get('color'); }
  set color(attr) { return this.set('color', attr); }

  get opened() { return this.get('opened'); }
  set opened(attr) { return this.set('opened', attr); }

  get items() { return this.get('items'); }
  set items(attr) { return this.set('items', attr); }
}

Chest.schema = {
  color: Joi.valid('GREEN', 'ORANGE', 'GRAY'),
  opened: Joi.bool(),
  items: Joi.array().items(Joi.object().instance(Moralis.Object)),
};

Moralis.Object.registerSubclass('Chest', Chest);
module.exports = Chest;
