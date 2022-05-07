'use strict';
const Building = require('./base/building');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Portal extends Building {
  // constructor() {
  //   // Pass the ClassName to the Moralis.Object constructor
  //   super('Portal');
  // }
  static create({
    playerId,
    location = 0,
  }) {
    const o = new Portal();
    o.type = 'Portal';
    o.subType = 'Portal';
    o.location = 0;
    o.playerId = playerId;
    o.location = location;
    o.status = 'INUSE';
    return o;
  }

  static async findByPlayerId(playerId) {
    return super.findByPlayerId(playerId, {
      type: 'Portal',
      subType: 'Portal',
    });
  }
}

Portal.schema = {
  type: Joi.valid('Portal'),
  subType: Joi.valid('Portal'),
};
module.exports = Portal;
