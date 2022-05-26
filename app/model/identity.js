'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');

class Identity extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Identity');
  }

  get avatar() { return this.get('avatar'); }
  set avatar(attr) { return this.set('avatar', attr); }

  get color() { return this.get('color'); }
  set color(attr) { return this.set('color', attr); }

  static getContractAddress() {
    return 'identity';
  }

  async mint(owner) {
    const { color, avatar } = this;
    const metaData = { color, avatar };
    const tokenId = await Identity.mint721(owner, metaData);
    this.tokenId = tokenId;
    this.name = this.name || `identity#${tokenId}`;
  }
}

Identity.schema = {
  avatar: Joi.string(),
  color: Joi.valid('ORANGE', 'GRAY', 'GREEN', 'BLUE'),
};

Moralis.Object.registerSubclass('Identity', Identity);
module.exports = Identity;
