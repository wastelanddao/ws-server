'use strict';
const Building = require('./base/building');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Hall extends Building {
  // constructor() {
  //   // Pass the ClassName to the Moralis.Object constructor
  //   super('Hall');
  // }
  static create({
    playerId,
    location = 0,
  }) {
    const hall = new Hall();
    hall.type = 'Hall';
    hall.subType = 'Hall';
    hall.location = 0;
    hall.playerId = playerId;
    hall.location = location;
    hall.status = 'INUSE';
    return hall;
  }

  static async findByPlayerId(playerId) {
    return super.findByPlayerId(playerId, {
      type: 'Hall',
      subType: 'Hall',
    });
  }
}

Hall.schema = {
  type: Joi.valid('Hall'),
  subType: Joi.valid('Hall'),
};
module.exports = Hall;
