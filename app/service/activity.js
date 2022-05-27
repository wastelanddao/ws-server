'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Activity = require('../model/activity');
const Food = require('../model/food');
const Player = require('../model/player');
const Villager = require('../model/villager');
class ActivityService extends Service {
  async doActivity(actType, villagerIds, foodInfos) {
    const playerId = this.ctx.state.user.id;
    let happinessPoint;
    let foods = [];
    if (actType !== 'Picking Fruits') {
      const foodIds = foodInfos.map(f => f.id);
      foods = await Food.findByIn('objectId', foodIds);
      if (!foods.length) {
        throw new Error('need feed food');
      }
      happinessPoint = this.calculationHappiness(foods);
      // 查询余额
      const balances = await Promise.all(foods.map(f => f.balanceOf()));
      balances.forEach((balance, idx) => {
        if (!balance > 0) {
          throw new Error(`balance not enough for ${foods[idx].id}`);
        }
      });
    }

    let ret;
    switch (actType) {
      case 'Hunting': {
        const [ villagerId ] = villagerIds;
        ret = await this.doHunting(playerId, villagerId, happinessPoint);
        break;
      }
      case 'Picking Fruits': {
        const [ villagerId ] = villagerIds;
        ret = await this.doPicking(playerId, villagerId);
        break;
      }
      case 'Exploring': {
        const [ villagerId ] = villagerIds;
        ret = await this.doExploring(playerId, villagerId, happinessPoint);
        break;
      }
      case 'Pregnant': {
        const [ fatherId, motherId ] = villagerIds;
        ret = await this.doGivingBirth(playerId, fatherId, motherId, happinessPoint);
        break;
      }
      default:
        this.ctx.throw('act type error', 400);
    }
    // food扣除
    await Promise.all(foods.map(f => f.burn(1)));
    return ret;
  }

  async getByPlayerId(playerId, status) {
    const arr = await Activity.findByPlayerId(playerId, { status });
    return arr;
  }

  async doPicking(playerId, villagerId) {
    const player = await Player.findById(playerId);
    if (!player) {
      return this.ctx.throw('player not exists', 404);
    }
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
    const { endurance } = this.service.villager.identityAttributes(villager, player);
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

  async doHunting(playerId, villagerId, happinessPoint) {
    const player = await Player.findById(playerId);
    if (!player) {
      return this.ctx.throw('player not exists', 404);
    }
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
    act.happiness = happinessPoint;
    const now = new Date();
    act.startTime = now;
    const { endurance } = this.service.villager.identityAttributes(villager, player);
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

  async doGivingBirth(playerId, fatherId, motherId, happinessPoint) {
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
    act.happiness = happinessPoint;
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

  async doExploring(playerId, villagerId, happinessPoint) {
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
    act.happiness = happinessPoint;
    const now = new Date();
    act.startTime = now;
    // 总探索时常=SQRT（耐力*1.2）+24
    const { endurance } = villager;
    const hours = Math.sqrt(endurance * 1.2) + 24;
    act.dueTime = new Date(now.getTime() + hours * 3600 * 1000);
    act.status = 'STARTED';
    villager.activity.push(act);
    await villager.save();
    return act;
  }
  async getActivityById(id) {
    const activity = await Activity.findById(id);
    if (!activity) {
      throw new Error(`activity ${id} not found`);
    }

    const check = async () => {
      if (activity.status === 'STARTED'
      // && new Date() > activity.dueTime
      ) {
        const { foods, villagers, chests } = await this.finishActivity(activity);
        if (activity.status === 'STARTED') {
          //  针对explore的特殊处理：有可能会失败，失败了有延期机制
          return check();
        }
        return {
          activity,
          foods,
          villagers,
          chests,
        };
      }
      return {
        activity,
      };
    };
    return check();

  }
  async finishActivity(activity) {
    const villager = await Villager.findOwnById(activity.villagerId, this.ctx.state.user.id);

    switch (activity.type) {
      case 'Picking Fruits' : {
        const strawberry = await this.service.item.finishPicking(villager, activity);
        return {
          foods: [ strawberry ],
        };
      }
      case 'Hunting' : {
        const venison = await this.service.item.finishHunting(villager, activity);
        return {
          foods: [ venison ],
        };
      }
      case 'Exploring' : {
        const chests = await this.service.item.finishExploring(villager, activity);
        return { chests };
      }
      case 'Pregnant' : {
        const child = await this.service.villager.finishPregnant(activity);
        return { villagers: [ child ] };
      }
      default: {
        break;
      }
    }
  }
  calculationHappiness(foods) {
    const foodCategorySet = new Set();
    let happinessPoint = 10;
    for (const food of foods) {
      const { category, happiness } = food;
      if (foodCategorySet.has(category)) {
        throw new Error('each category can select only 1');
      }
      foodCategorySet.add(food.category);
      happinessPoint += happiness;
    }
    return happinessPoint;
  }
}

module.exports = ActivityService;
