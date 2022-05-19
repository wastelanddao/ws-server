'use strict';
const Item = require('./base/item');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Tool extends Item {
  constructor(attr) {
    super(attr);
    this.type = 'Tool';
  }
  get category() { return this.get('category'); }
  set category(val) { return this.set('category', val); }

  get timesLeft() { return this.get('timesLeft'); }
  set timesLeft(val) { return this.set('timesLeft', val); }

  get timesUsed() { return this.get('timesUsed'); }
  set timesUsed(val) { return this.set('timesUsed', val); }

  static getContractAddress() {
    return 'item_tool';
  }
}

Tool.schema = {
  type: Joi.valid('Tool'),
  category: Joi.valid('Basket', 'Bow'),
  timesLeft: Joi.number().integer().min(0), // 剩余使用次数
  timesUsed: Joi.number().integer().min(0), // 总共使用次数
};
module.exports = Tool;
