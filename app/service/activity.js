'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Activity = require('../model/Activity');
const Villager = require('../model/villager');
class ActivityService extends Service {
  async doActivity(playerId, villagerId, actType) {
    switch (actType) {
      case 'Hunting':
        return await this.doHunting(playerId, villagerId);
      case 'Picking Fruits':
        return await this.doPicking(playerId, villagerId);
      default:
        return this.ctx.throw('act type error', 400);
    }
  }

  async getByPlayerId(playerId) {
    const arr = await Activity.findByPlayerId(playerId);
    return arr;
  }

  async doPicking(playerId, villagerId) {
    const villager = await Villager.findOwnById(villagerId, playerId);
    if (!villager) {
      return this.ctx.throw('villager not exists', 404);
    }
    const act = new Activity();
    act.playerId = playerId;
    act.villagerId = villagerId;
    act.type = 'Picking Fruits';
    const now = new Date();
    act.startTime = now;
    const { endurance } = villager;
    let hours = 24;
    if (endurance > 20) {
      hours = 24 - (endurance - 20) / 20;
    }
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    villager.activity.push(act);
    await villager.save();
    return act;
  }

  async doHunting(playerId, villagerId) {
    const villager = await Villager.findOwnById(villagerId, playerId);
    if (!villager) {
      return this.ctx.throw('villager not exists', 404);
    }
    const act = new Activity();
    act.playerId = playerId;
    act.villagerId = villagerId;
    act.type = 'Hunting';
    const now = new Date();
    act.startTime = now;
    const { endurance } = this;
    let hours = 24;
    if (endurance > 20) {
      hours = 24 - (endurance - 20) / 20;
    }
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    villager.activity.push(act);
    await villager.save();
    return act;
  }

  async doGivingBirth(playerId, villagerId1, villagerId2) {
    const [ villager1, villager2 ] = await Promise.all([
      Villager.findOwnById(villagerId1, playerId),
      Villager.findOwnById(villagerId2, playerId),
    ]);
    if (!villager1) {
      this.ctx.throw(`villager ${villagerId1} not exists`, 404);
    }
    if (!villager2) {
      this.ctx.throw(`villager ${villagerId2} not exists`, 404);
    }
    if (villager1.gender === villager2.gender) {
      this.ctx.throw('must a male and a female', 400);
    }

  }
}

module.exports = ActivityService;
