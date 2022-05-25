'use strict';
const Joi = require('joi');
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');

class Contribution extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Contribution');
  }

  get owner() { return this.get('owner'); }
  set owner(val) { return this.set('owner', val); }

  get contract() { return this.get('contract'); }
  set contract(val) { return this.set('contract', val); }

  get tokenId() { return this.get('tokenId'); }
  set tokenId(val) { return this.set('tokenId', val); }

  get num() { return this.get('num'); }
  set num(attr) { return this.set('num', attr); }

  get metal() { return this.get('metal'); }
  set metal(attr) { return this.set('metal', attr); }

  get wood() { return this.get('wood'); }
  set wood(attr) { return this.set('wood', attr); }

  get water() { return this.get('water'); }
  set water(attr) { return this.set('water', attr); }

  get fire() { return this.get('fire'); }
  set fire(attr) { return this.set('fire', attr); }

  get earth() { return this.get('earth'); }
  set earth(attr) { return this.set('earth', attr); }

}

Contribution.schema = {
  owner: Joi.string(),
  contract: Joi.string(),
  tokenId: Joi.string(),
  num: Joi.number().integer(),
  metal: Joi.number().integer(),
  wood: Joi.number().integer(),
  water: Joi.number().integer(),
  fire: Joi.number().integer(),
  earth: Joi.number().integer(),
};

Moralis.Object.registerSubclass('Contribution', Contribution);

module.exports = Contribution;
