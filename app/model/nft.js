'use strict';
const Joi = require('joi');
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');

const colorSet = new Set([ 'GRAY', 'GREEN', 'BLUE', 'ORANGE' ]);
class NFT extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('NFT');
  }
  get contract() {
    return this.get('contract');
  }
  set contract(attr) {
    return this.set('contract', attr);
  }
  get tokenId() {
    return this.get('tokenId');
  }
  set tokenId(attr) {
    return this.set('tokenId', attr);
  }
  get avatar() {
    return this.get('avatar');
  }
  set avatar(attr) {
    return this.set('avatar', attr);
  }
  get color() {
    return this.get('color');
  }
  set color(attr) {
    if (!colorSet.has(attr)) {
      throw new Error(`color only can be one of ${colorSet.values}`);
    }
    return this.set('color', attr);
  }
}

NFT.schema = {
  contract: Joi.string(),
  tokenId: Joi.string(),
  avatar: Joi.string(),
  color: Joi.valid('GRAY', 'GREEN', 'BLUE', 'ORANGE'),
};
Moralis.Object.registerSubclass('NFT', NFT);
module.exports = NFT;
