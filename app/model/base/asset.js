'use strict';
const BaseObject = require('./base');
const NFT = require('../nft');
const Joi = require('joi');

class Asset extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Asset');
    // nft ref
    this.nft = undefined;
  }
  schema() {
    return Joi.object({
      nft: Joi.object().instance(NFT),
    }).unknown();
  }
  get nft() {
    return this.get('nft');
  }
  set nft(attr) {
    this.set('nft', attr);
  }
}
module.exports = Asset;
