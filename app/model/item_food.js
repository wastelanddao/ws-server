'use strict';
const Item = require('./base/item');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Food extends Item {
  constructor(attr) {
    super(attr);
    this.type = 'Food';
  }
  get category() { return this.get('category'); }
  set category(val) { return this.set('category', val); }

  get grade() { return this.get('grade'); }
  set grade(val) { return this.set('grade', val); }

  get originalNum() { return this.get('originalNum'); }
  set originalNum(val) { return this.set('originalNum', val); }
}

Food.schema = {
  type: Joi.valid('Food'),
  category: Joi.valid('Fruits', 'Wine', 'Venison', 'Wheat', 'Pork'), // 分类
  grade: Joi.number().integer().min(1), // 等级1-3
  originalNum: Joi.number().integer().min(0), // 原始数量，num会逐渐减少，但是originalNum不会
};
module.exports = Food;
