'use strict';
const Base = require('../base/base');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class MockBase extends Base {
  get owner() { return this.get('owner'); }
  set owner(attr) { return this.set('owner', attr); }

  get tokenId() { return this.get('tokenId'); }
  set tokenId(attr) { return this.set('tokenId', attr); }

  get num() { return this.get('num'); }
  set num(attr) { return this.set('num', attr); }

  get metaData() { return this.get('metaData'); }
  set metaData(attr) { return this.set('metaData', attr); }

  get contract() { return this.get('contract'); }
  set contract(attr) { return this.set('contract', attr); }

  static async findByWallet(contract, wallet, tokenId = undefined) {
    if (!contract || !wallet) {
      throw new Error('need contract and wallet');
    }
    const query = this.query();
    query.equalTo('owner', wallet);
    query.equalTo('contract', contract);
    if (tokenId) {
      query.equalTo('tokenId', tokenId);
    }
    const os = await query.find({ useMasterKey: true });
    return os;
  }
  static async findByTokenId(contract, tokenId) {
    const query = this.query();
    query.equalTo('contract', contract);
    query.equalTo('tokenId', tokenId);
    const os = await query.find({ useMasterKey: true });
    return os;
  }
}

MockBase.schema = {
  owner: Joi.string(),
  contract: Joi.string(),
  tokenId: Joi.string(),
  num: Joi.number().integer().min(0),
  metaData: Joi.object(),
};

module.exports = MockBase;
