'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base');

const colorSet = new Set([ 'GRAY', 'GREEN', 'BLUE', 'ORANGE' ]);
class NFT extends BaseObject {
  constructor(contract, tokenId) {
    // Pass the ClassName to the Moralis.Object constructor
    super('NFT');
    if (!contract || !tokenId) {
      throw new Error('need contract and tokenId');
    }
    this.contract = contract;
    this.tokenId = tokenId;
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
Moralis.Object.registerSubclass('NFT', NFT);
module.exports = NFT;
