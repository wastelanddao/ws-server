'use strict';
const Building = require('./base/building');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Warehouse extends Building {
  // constructor() {
  //   // Pass the ClassName to the Moralis.Object constructor
  //   super('Warehouse');
  // }
  static create({
    playerId,
    location = 0,
  }) {
    const o = new Warehouse();
    o.type = 'Warehouse';
    o.subType = 'Warehouse';
    o.location = 0;
    o.playerId = playerId;
    o.location = location;
    o.status = 'INUSE';
    return o;
  }

  static async findByPlayerId(playerId) {
    return super.findByPlayerId(playerId, {
      type: 'Warehouse',
      subType: 'Warehouse',
    });
  }
}

Warehouse.schema = {
  type: Joi.valid('Warehouse'),
  subType: Joi.valid('Warehouse'),
};
module.exports = Warehouse;
