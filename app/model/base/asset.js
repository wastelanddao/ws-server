'use strict';
const BaseObject = require('./base');
// const NFT = require('../nft');
const Moralis = require('moralis/node');
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

  get tradable() { return this.get('tradable'); }
  set tradable(val) { return this.set('tradable', val); }
}

Asset.schema = {
  nft: Joi.object().instance(Moralis.Object),
  playerId: Joi.string(),
  tradable: Joi.bool(),
};

module.exports = Asset;
