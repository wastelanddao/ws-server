'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Activity = require('../model/activity');
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
      case 'Exploring': {
        const [ villagerId ] = villagerIds;
        return await this.doExploring(playerId, villagerId);
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
      // 特殊处理：female怀孕的时候可以采摘/打猎
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
    const { realEndurance: endurance } = villager;
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
    villager.activity.forEach(act => {
      // 特殊处理：female怀孕的时候可以采摘/打猎
      if (act.type !== 'Pregnant') {
        return this.ctx.throw('already in working');
      }
    });
    const act = new Activity();
    act.playerId = playerId;
    act.villagerId = villagerId;
    act.type = 'Hunting';
    const now = new Date();
    act.startTime = now;
    const { realEndurance: endurance } = villager;
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
    if (!father.isAdult || !mother.isAdult) {
      this.ctx.throw('must be adult');
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
    await Promise.all([
      mother.save(),
      father.save(),
    ]);
    return act;
  }

  async doExploring(playerId, villagerId) {
    const villager = await Villager.findOwnById(villagerId, playerId);
    if (!villager) {
      return this.ctx.throw('villager not exists', 404);
    }
    if (!villager.isAdult) {
      this.ctx.throw('must be adult');
    }
    if (villager.activity.length > 0) {
      return this.ctx.throw('already in working');
    }
    const act = new Activity();
    act.playerId = playerId;
    act.villagerId = villagerId;
    act.type = 'Exploring';
    const now = new Date();
    act.startTime = now;
    // 总探索时常=SQRT（耐力*1.2）+24
    const { endurance } = this;
    const hours = Math.sqrt(endurance * 1.2) + 24;
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    villager.activity.push(act);
    await villager.save();
    return act;
  }
  async getActivityById(id) {
    const activity = await Activity.findById(id);
    await this.finishActivity(activity);
    return activity;

  }
  async finishActivity(activity) {
    const villager = await Villager.findOwnById(activity.villagerId, this.ctx.state.user.id);
    const now = new Date();
    if (now < activity.dueTime || activity.status === 'ENDED') {
      return;
    }
    let finished;
    switch (activity.type) {
      case 'Picking Fruits' : {
        finished = await this.service.item.finishPicking(villager, activity);
        break;
      }
      case 'Hunting' : {
        finished = await this.service.item.finishHunting(villager, activity);
        break;
      }
      case 'Exploring' : {
        finished = await this.service.item.finishExploring(villager, activity);
        break;
      }
      default: {
        break;
      }
    }
    if (finished) {
      // activity数组中只保留进行中的
      villager.activity = villager.activity.filter(act => act.id !== activity.id);
      villager.save();
    }
  }
}

module.exports = ActivityService;
