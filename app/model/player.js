'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');
const NFT = require('./nft');
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
  get contribution() {
    return this.get('contribution');
  }
  set contribution(attr) {
    return this.set('contribution', attr);
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

  static fromUser(user) {
    const player = new Player();
    player.name = `player ${user.username}`;
    player.wallet = user.ethAddress;
    player.location = '0'; // 坐标
    player.populationCapacity = 3; // 人口上限
    player.identity = undefined; // 身份nft
    player.contribution = {
      metal: 0,
      wood: 0,
      water: 0,
      fire: 0,
      earth: 0,
    }; // 贡献
    player.rewards = 0; // 回报
    player.setp = 0; // guide step
    return player;
  }
  static async getByWallet(address) {
    return await this.query().equalTo('wallet', address).first({ useMasterKey: true });
  }
}

Player.schema = {
  name: Joi.string(),
  wallet: Joi.string(),
  location: Joi.string(),
  populationCapacity: Joi.number().integer().min(0),
  identity: Joi.object().instance(NFT),
  contribution: Joi.object({
    metal: Joi.number().integer().min(0),
    wood: Joi.number().integer().min(0),
    water: Joi.number().integer().min(0),
    fire: Joi.number().integer().min(0),
    earth: Joi.number().integer().min(0),
  }),
  rewards: Joi.number().min(0),
  setp: Joi.number().integer().min(0),
};
Moralis.Object.registerSubclass('Player', Player);
module.exports = Player;
