'use strict';
const Moralis = require('moralis/node');
const Contribution = require('./contribution');
const BaseObject = require('./base');
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
    player.name = `player ${user.attributes.username}`;
    player.wallet = user.attributes.ethAddress;
    player.location = ''; // 坐标
    player.populationCapacity = 3; // 人口上限
    player.identity = undefined; // 身份nft
    player.contribution = new Contribution(); // 贡献
    player.rewards = 0; // 回报
    player.setp = 0; // guide step
    return player;
  }
}
Moralis.Object.registerSubclass('Player', Player);
module.exports = Player;
