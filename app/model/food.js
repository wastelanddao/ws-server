'use strict';
const Asset = require('./base/asset');
const Moralis = require('moralis/node');
const foodInfo = require('./food_info');
const Joi = require('joi');

class Food extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Food');
  }

  // note：1155协议才会有owner字段
  get owner() { return this.get('owner'); }
  set owner(val) { return this.set('owner', val); }

  // note：这个num只是代表临时数量，不代表balance，也不会存入数据库，save方法也不允许有这个字段
  get num() { return this.get('num'); }
  set num(val) { return this.set('num', val); }

  get category() { return this.get('category'); }
  set category(val) { return this.set('category', val); }

  get happiness() { return this.get('happiness'); }
  set happiness(val) { return this.set('happiness', val); }


  static getContractAddress() {
    return 'food';
  }
  async mint(num) {
    return await Food.mint1155(this.owner, this.tokenId, num);
  }
  async burn(num) {
    return await Food.burn1155(this.owner, this.tokenId, num);
  }
  // 查询余额
  async balanceOf() {
    const balance = await Food.balanceOf1155(this.tokenId, this.owner);
    return balance;
  }
  static createFromTokenId(tokenId, owner) {
    const foodInfos = Object.values(foodInfo);
    const info = foodInfos.find(f => f.tokenId === tokenId);
    if (!info) {
      throw new Error('wrong token id');
    }
    const food = new Food();
    food.tokenId = info.tokenId;
    food.owner = owner;
    food.name = info.name;
    food.category = info.category;
    food.happiness = info.happiness;
    food.tradable = true;
    return food;
  }
  // find or create
  static async getOrCreate(owner, tokenId) {
    let [ exists ] = await this.findByEqual({
      owner,
      tokenId,
    });
    if (!exists) {
      exists = this.createFromTokenId(tokenId, owner);
      await exists.save();
    }
    return exists;
  }

  // 转换成item格式，接口返回统一格式
  toItem() {
    const json = this.toJson();
    return {
      ...json,
      type: 'Food',
      status: 'INSTOCK',
    };
  }

  static async findByPlayerId(pid) {
    pid;
    throw new Error('not impl');
  }

  static async findByWallet(owner) {
    const nfts = await this.getNFTs(owner);
    const foods = [];
    for (const nft of nfts) {
      const { tokenId, num } = nft;
      const food = await this.getOrCreate(owner, tokenId);
      food.num = num;
      foods.push(food);
    }
    return foods;
  }
  // 获取所有食物类型的信息
  static async getFoodInfos(owner) {
    const foods = await this.findByWallet(owner);
    return foods.map(food => {
      return food.toItem();
    });
  }
}

Food.schema = {
  owner: Joi.string(),
  category: Joi.string(),
  happiness: Joi.number().integer(),
};

Moralis.Object.registerSubclass('Food', Food);
module.exports = Food;
