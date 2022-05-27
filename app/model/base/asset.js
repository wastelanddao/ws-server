'use strict';
const BaseObject = require('./base');
// const NFT = require('../nft');
const Moralis = require('moralis/node');
const Joi = require('joi');
const MockNFT = require('../mock/mockNFT');
const Player = require('../player');
const uuid = require('uuid').v4;
// const consts = require('../const');
class Asset extends BaseObject {
  get name() { return this.get('name'); }
  set name(attr) { this.set('name', attr); }

  get description() { return this.get('description'); }
  set description(attr) { this.set('description', attr); }

  get image() { return this.get('image'); }
  set image(attr) { this.set('image', attr); }

  get tokenId() { return this.get('tokenId'); }
  set tokenId(attr) { this.set('tokenId', attr); }

  get tradable() { return this.get('tradable'); }
  set tradable(val) { return this.set('tradable', val); }

  get activityId() { return this.get('activityId'); }
  set activityId(val) { return this.set('activityId', val); }

  static getContractAddress() {
    throw new Error('must override this function');
  }

  static async mint721(owner, metaData) {
    if (!owner) {
      throw new Error('need owner');
    }
    const contract = this.getContractAddress();
    const nft = new MockNFT();
    nft.contract = contract;
    nft.metaData = metaData;
    nft.owner = owner;
    nft.num = 1;
    nft.tokenId = uuid();
    await nft.save();
    return nft.tokenId;
  }
  static async mint1155(owner, tokenId, num) {
    if (!owner || !tokenId || !num) {
      throw new Error('need owner tokenId num');
    }
    const contract = this.getContractAddress();
    const [ nft ] = await MockNFT.findByWallet(contract, owner, tokenId);
    if (!nft) {
      const nft = new MockNFT();
      nft.contract = contract;
      nft.metaData = {};
      nft.owner = owner;
      nft.num = num;
      nft.tokenId = tokenId;
      await nft.save();
      return num;
    }
    nft.num += num;
    await nft.save();
    // return nft.num;
  }
  static async balanceOf1155(tokenId, owner) {
    const contract = this.getContractAddress();
    const [ nft ] = await MockNFT.findByWallet(contract, owner, tokenId);
    if (!nft) {
      return 0;
    }
    return nft.num;
  }
  static async ownerOf721(tokenId) {
    const contract = this.getContractAddress();
    const [ nft ] = await MockNFT.findByTokenId(contract, tokenId);
    if (!nft) {
      throw new Error('nft not found');
    }
    return nft.owner;
  }
  static async burn721(owner, tokenId) {
    const contract = this.getContractAddress();
    const [ nft ] = await MockNFT.findByWallet(contract, owner, tokenId);
    if (!nft) {
      throw new Error('nft not found');
    }
    await nft.destroy();
  }
  static async burn1155(owner, tokenId, num) {
    const contract = this.getContractAddress();
    const [ nft ] = await MockNFT.findByWallet(contract, owner, tokenId);
    if (!nft) {
      throw new Error('nft not found');
    }
    if (nft.num < num) {
      throw new Error('nft num not enough');
    }
    nft.num -= num;
    await nft.save();
  }

  // 获取用户所有的nft，支持多合约
  static async getNFTs(owner, ...contracts) {
    if (!contracts.length) {
      contracts = [ this.getContractAddress() ];
    }
    const arr = await Promise.all(contracts.map(contract => MockNFT.findByWallet(contract, owner)));
    return arr.reduce((all, item) => [ ...all, ...item ], []);
  }

  static async getTokenIds(owner, ...contracts) {
    const arr = await this.getNFTs(owner, ...contracts);
    return arr.map(item => item.tokenId);
  }
  static async findByWallet(owner, {
    includes = [],
    filter = undefined,
  } = {}) {
    const tokenIds = await this.getTokenIds(owner);
    if (!tokenIds.length) {
      return [];
    }
    let query = Moralis.Query.or(...tokenIds.map(id => this.query().equalTo('tokenId', id)));
    if (filter) {
      const keys = Object.keys(filter);
      if (keys.length) {
        const query1 = this.query();
        for (const key of keys) {
          query1.equalTo(key, filter[key]);
        }
        query = Moralis.Query.and(query, query1);
      }
    }
    for (const include of includes) {
      query.include(include);
    }
    return await query.find({ useMasterKey: true });
  }

  static async findByPlayerId(playerId, {
    includes = [],
    filter = undefined,
  } = {}) {
    const player = await Player.findById(playerId);
    return this.findByWallet(player.wallet, {
      includes,
      filter,
    });
  }
}

Asset.schema = {
  tokenId: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  tradable: Joi.bool(),
  activityId: Joi.string(),
};

module.exports = Asset;
