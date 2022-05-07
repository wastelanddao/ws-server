'use strict';
const Asset = require('./asset');
const Joi = require('joi');
const Moralis = require('moralis/node');

class Item extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Item');
  }
  get type() {
    return this.get('type');
  }
  set type(attr) {
    return this.set('type', attr);
  }
  get name() {
    return this.get('name');
  }
  set name(attr) {
    return this.set('name', attr);
  }
  get num() {
    return this.get('num');
  }
  set num(attr) {
    return this.set('num', attr);
  }
  get quality() {
    return this.get('quality');
  }
  set quality(attr) {
    return this.set('quality', attr);
  }
  get strength() {
    return this.get('strength');
  }
  set strength(attr) {
    return this.set('strength', attr);
  }
  get luck() {
    return this.get('luck');
  }
  set luck(attr) {
    return this.set('luck', attr);
  }
  get endurance() {
    return this.get('endurance');
  }
  set endurance(attr) {
    return this.set('endurance', attr);
  }
  get durability() {
    return this.get('durability');
  }
  set durability(attr) {
    return this.set('durability', attr);
  }
  get status() {
    return this.get('status');
  }
  set status(attr) {
    return this.set('status', attr);
  }
}

Item.schema = {
  type: Joi.valid('Food', 'Tool', 'Weapon', 'Dress', 'Pet'),
  name: Joi.string(),
  num: Joi.number().integer(),
  quality: Joi.number().integer(),
  strength: Joi.number().integer(),
  luck: Joi.number().integer(),
  endurance: Joi.number().integer(),
  durability: Joi.number().integer(),
  status: Joi.valid('INSTOCK', 'CARRIED'),
};

Moralis.Object.registerSubclass('Item', Item);
module.exports = Item;
