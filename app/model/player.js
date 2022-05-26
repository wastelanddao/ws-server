'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');
// const NFT = require('./nft');
const Joi = require('joi');
class Player extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Player');
  }
  get name() {
    return this.get('name');
  }
  set name(attr) {
    return this.set('name', attr);
  }
  get wallet() {
    return this.get('wallet');
  }
  set wallet(attr) {
    return this.set('wallet', attr);
  }
  get location() {
    return this.get('location');
  }
  set location(attr) {
    return this.set('location', attr);
  }
  get populationCapacity() {
    return this.get('populationCapacity');
  }
  set populationCapacity(attr) {
    return this.set('populationCapacity', attr);
  }
  get identity() {
    return this.get('identity');
  }
  set identity(attr) {
    return this.set('identity', attr);
  }
  get rewards() {
    return this.get('rewards');
  }
  set rewards(attr) {
    return this.set('rewards', attr);
  }
  get setp() {
    return this.get('setp');
  }
  set setp(attr) {
    return this.set('setp', attr);
  }

  get extraInfo() {
    return this.get('extraInfo');
  }
  set extraInfo(attr) {
    return this.set('extraInfo', attr);
  }

  static fromUser(user) {
    const player = new Player();
    player.name = `player ${user.username}`;
    player.wallet = user.ethAddress;
    player.location = '0,0'; // 坐标
    player.populationCapacity = 5; // 人口上限
    // const identity = new NFT();
    // identity.contract = '0x0';
    // identity.tokenId = '0x1';
    // identity.avatar = '';
    // identity.color = 'GRAY';
    // player.identity = identity; // 身份nft
    player.rewards = 0; // 回报
    player.setp = 1; // guide step
    return player;
  }
  static async getByWallet(address) {
    return await this.query()
      .equalTo('wallet', address)
      .include('identity')
      .first({ useMasterKey: true });
  }
}

Player.schema = {
  name: Joi.string(),
  wallet: Joi.string(),
  location: Joi.string(),
  populationCapacity: Joi.number().integer().min(0),
  identity: Joi.any(),
  rewards: Joi.number().min(0),
  setp: Joi.number().integer().min(0),
  extraInfo: Joi.object(),
};
Moralis.Object.registerSubclass('Player', Player);
module.exports = Player;
