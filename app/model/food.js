'use strict';
const Asset = require('./base/asset');
const Moralis = require('moralis/node');
const foodInfo = require('./food_info');

class Food extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Food');
  }

  static getContractAddress() {
    return 'food';
  }
  async mint(owner) {
    await Food.mint1155(owner, this.tokenId, this.num);
  }
  static createFromTokenId(tokenId, num) {
    const foodInfos = Object.values(foodInfo);
    const info = foodInfos.find(f => f.tokenId === tokenId);
    if (!info) {
      throw new Error('wrong token id');
    }
    const food = new Food();
    food.tokenId = info.tokenId;
    food.num = num;
    food.tradable = true;
    return food;
  }

  getInfo() {
    const info = Object.values(foodInfo).find(info => info.tokenId === this.tokenId);
    return info;
  }
  toJsonWithInfo() {
    const json = this.toJson();
    return Object.assign({}, json, this.getInfo());
  }

  toItem() {
    const json = this.toJsonWithInfo();
    return {
      ...json,
      type: 'Food',
      status: 'INSTOCK',
    };
  }

  static async findByActivityId(actId) {
    const query = this.query();
    query.equalTo('activityId', actId);
    return await query.find({ useMasterKey: true });
  }
}

Food.schema = {
};

Moralis.Object.registerSubclass('Food', Food);
module.exports = Food;
