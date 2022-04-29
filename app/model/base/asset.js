'use strict';
const BaseObject = require('./base');
const NFT = require('../nft');
const Joi = require('joi');

class Asset extends BaseObject {
  get nft() {
    return this.get('nft');
  }
  set nft(attr) {
    this.set('nft', attr);
  }
  get playerId() {
    return this.get('playerId');
  }
  set playerId(attr) {
    this.set('playerId', attr);
  }
}

Asset.schema = {
  nft: Joi.object().instance(NFT),
  playerId: Joi.string(),
};

module.exports = Asset;
