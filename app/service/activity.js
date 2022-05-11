'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Activity = require('../model/Activity');
const Villager = require('../model/villager');
class ActivityService extends Service {
  async doActivity(playerId, actType, ...villagerIds) {
    switch (actType) {
      case 'Hunting': {
        const [ villagerId ] = villagerIds;
        return await this.doHunting(playerId, villagerId);
      }
      case 'Picking Fruits': {
        const [ villagerId ] = villagerIds;
        return await this.doPicking(playerId, villagerId);
      }
      case 'Pregnant': {
        const [ fatherId, motherId ] = villagerIds;
        return await this.doGivingBirth(playerId, fatherId, motherId);
      }
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
    villager.activity.forEach(act => {
      // 特殊处理：female怀孕的时候可以采摘
      if (act.type !== 'Pregnant') {
        return this.ctx.throw('already in working');
      }
    });
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
    if (villager.activity.length > 0) {
      return this.ctx.throw('already in working');
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

  async doGivingBirth(playerId, fatherId, motherId) {
    const [ father, mother ] = await Promise.all([
      Villager.findOwnById(fatherId, playerId),
      Villager.findOwnById(motherId, playerId),
    ]);
    if (!father) {
      this.ctx.throw(`villager ${fatherId} not exists`, 404);
    }
    if (!mother) {
      this.ctx.throw(`villager ${motherId} not exists`, 404);
    }

    if (father.gender !== 'MALE') {
      this.ctx.throw('father must a male');
    }
    if (mother.gender !== 'FEMALE') {
      this.ctx.throw('mother must a female');
    }

    if (father.activity.length > 0) {
      return this.ctx.throw('father already in working');
    }
    if (mother.activity.length > 0) {
      return this.ctx.throw('mother already in working');
    }

    const act = new Activity();
    act.type = 'Pregnant';
    const now = new Date();
    act.startTime = now;
    act.playerId = playerId;
    act.villagerId = mother.id;
    act.status = 'STARTED';
    const days = 20;
    act.dueTime = new Date(now.getTime() + days * 24 * 3600 * 1000);
    act.extraInfo = Object.assign({}, act.extraInfo, {
      fatherId,
    });
    mother.activity.push(act);
    await mother.save();
    return act;
  }
  async getActivityById(id) {
    const activity = await Activity.findById(id);
    await this.finishActivity(activity);
    return activity;

  }
  async finishActivity(activity) {
    const villager = await Villager.findById(activity.villagerId);
    const now = new Date();
    if (now < activity.dueTime) {
      return;
    }
    switch (activity.type) {
      case 'Picking Fruits' : {
        await this.service.item.finishPicking(villager, activity.id);
        break;
      }
      case 'Hunting' : {
        await this.service.item.finishHunting(villager, activity.id);
        break;
      }
      case 'Exploring' : {
        await this.service.item.finishExploring(villager, activity.id);
        break;
      }
      default: {
        break;
      }
    }
  }
}

module.exports = ActivityService;
