'use strict';
const Building = require('./base/building');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Hut extends Building {
  // constructor() {
  //   // Pass the ClassName to the Moralis.Object constructor
  //   super('Hut');
  // }
  static create({
    playerId,
    location = 0,
  }) {
    const hut = new Hut();
    hut.type = 'Hut';
    hut.subType = 'Hut';
    hut.location = 0;
    hut.villagers = [];
    hut.playerId = playerId;
    hut.location = location;
    hut.status = 'INUSE';
    return hut;
  }

  static async findByPlayerId(playerId) {
    const bs = await super.findByPlayerId(playerId, {
      type: 'Hut',
      subType: 'Hut',
    });
    bs.forEach(b => {
      this.convertType(b);
    });
    return bs;
  }
}

Hut.schema = {
  type: Joi.valid('Hut'),
  subType: Joi.valid('Hut'),
};
module.exports = Hut;
