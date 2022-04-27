'use strict';
const BaseObject = require('./base');
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
// 只是一个基类，不存数据表
// Moralis.Object.registerSubclass('Asset', Asset);
module.exports = Asset;
