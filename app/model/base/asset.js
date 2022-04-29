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
  get nft() {
    return this.get('nft');
  }
  set nft(attr) {
    this.set('nft', attr);
  }
}

Asset.schema = {
  nft: Joi.object().instance(NFT),
};

module.exports = Asset;
