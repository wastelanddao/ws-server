'use strict';
const Asset = require('./base/asset');
const Joi = require('joi');
const Moralis = require('moralis/node');
const helper = require('../extend/helper');
class Item extends Asset {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Item');
  }
  get type() { return this.get('type'); }
  set type(attr) { return this.set('type', attr); }

  get subType() { return this.get('subType'); }
  set subType(attr) { return this.set('subType', attr); }

  get quality() { return this.get('quality'); }
  set quality(attr) { return this.set('quality', attr); }

  get strength() { return this.get('strength'); }
  set strength(attr) { return this.set('strength', attr); }

  get luck() { return this.get('luck'); }
  set luck(attr) { return this.set('luck', attr); }

  get endurance() { return this.get('endurance'); }
  set endurance(attr) { return this.set('endurance', attr); }

  get durability() { return this.get('durability'); }
  set durability(attr) { return this.set('durability', attr); }

  get status() { return this.get('status'); }
  set status(attr) { return this.set('status', attr); }

  get style() { return this.get('style'); }
  set style(attr) { return this.set('style', attr); }

  get villagerId() { return this.get('villagerId'); }
  set villagerId(attr) { return this.set('villagerId', attr); }

  static getContractAddress() {
    return 'item';
  }

  async mint(owner) {
    const { type, name, quality, strength, luck, endurance } = this;
    const metaData = { type, name, quality, strength, luck, endurance };
    const tokenId = await Item.mint721(owner, metaData);
    this.tokenId = tokenId;
    this.name = this.name || `${this.subType}#${tokenId}`;
  }
  async burn(owner) {
    return Item.burn721(owner, this.tokenId);
  }

  async ownerOf() {
    return await Item.ownerOf721(this.tokenId);
  }
  randomStyle() {
    // 款式颜色随机
    const style = helper.randomRangInt([ 1, 10 ]);
    const color = helper.randomSelectWithRatio(
      [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      [ 0.30,	0.20,	0.10,	0.10,	0.10, 0.08, 0.06, 0.03, 0.02, 0.01 ]
    );
    this.style = helper.joinUint(10, color, style);
  }
}

Item.schema = {
  type: Joi.valid('Tool', 'Weapon', 'Dress', 'Pet'),
  subType: Joi.valid('Bow', 'Basket', 'Weapon', 'Pet', 'Head', 'Body', 'Legs', 'Feet'),
  style: Joi.number().integer().min(0),
  villagerId: Joi.string().allow(null),
  quality: Joi.number().integer(),
  strength: Joi.number().integer(),
  luck: Joi.number().integer(),
  endurance: Joi.number().integer(),
  durability: Joi.number().integer(),
  status: Joi.valid('INSTOCK', 'CARRIED'),
};

Moralis.Object.registerSubclass('Item', Item);
module.exports = Item;
