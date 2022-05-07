'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Activity = require('../model/Activity');
const Villager = require('../model/villager');
class ActivityService extends Service {
  async doActivity(playerId, villagerId, actType) {
    const villager = await Villager.findById(villagerId);
    if (playerId !== villager.playerId) {
      return this.ctx.throw('villager not belong to you');
    }
    if (!villager) {
      return this.ctx.throw('villager not exists', 404);
    }
    switch (actType) {
      case 'Hunting':
        return await villager.doHunting();
      case 'Picking Fruits':
        return await villager.doPicking();
      default:
        return this.ctx.throw('act type error', 400);
    }
  }

  async getByPlayerId(playerId) {
    const arr = await Activity.findByPlayerId(playerId);
    return arr;
  }
}

module.exports = ActivityService;
