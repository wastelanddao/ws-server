'use strict';
const Item = require('./base/item');
const Joi = require('joi');
// const Moralis = require('moralis/node');

class Food extends Item {
//   static create({
//     playerId,
//     location = 0,
//   }) {
//     const hall = new Hall();
//     hall.type = 'Hall';
//     hall.subType = 'Hall';
//     hall.location = 0;
//     hall.playerId = playerId;
//     hall.location = location;
//     hall.status = 'INUSE';
//     return hall;
//   }

//   static async findByPlayerId(playerId) {
//   }
}

Food.schema = {
  type: Joi.valid('Food'),
  category: Joi.valid('Fruits', 'Wine', 'Venison', 'Wheat', 'Pork'),
  grade: Joi.number().integer().min(1),
};
module.exports = Food;
