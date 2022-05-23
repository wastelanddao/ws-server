'use strict';
const Service = require('egg').Service;
const Chest = require('../model/chest');
const Food = require('../model/food');
const Player = require('../model/player');
// const Activity = require('../model/activity');
// const tokenIds = require('../model/tokenId.js');
const foodInfo = require('../model/food_info');
const Item = require('../model/item');
class ItemService extends Service {
  async finishPicking(villager, activity) {
    const { id: activityId, playerId } = activity;
    const player = await Player.findById(playerId);
    const { carriage = [] } = villager;
    let count = 1;
    carriage.forEach(item => {
      if (item.type === 'Tool' && item.name === 'Basket') {
        count = count * 2;
      }
    });
    const strawberry = new Food();
    strawberry.num = count;
    strawberry.tokenId = foodInfo.strawberry.tokenId;
    // strawberry.activityId = activityId;
    await strawberry.mint(player.wallet);
    await strawberry.save();
    activity.status = 'ENDED';
    await activity.save();
    villager.activity = villager.activity.filter(act => act.id !== activity.id);
    await villager.save();
    return strawberry;
  }
  async finishHunting(villager, activity) {
    const { id: activityId, happiness, playerId } = activity;
    const player = await Player.findById(playerId);
    let { carriage = [], realLuck: luck, realStrength: strength } = villager;
    luck = luck * happiness / 100;
    strength = strength * happiness / 100;
    let totalNum = 0;
    // 打猎次数：=1+力量/20
    const times = this.ctx.helper.randomTimes(1 + strength / 20);
    for (let i = 0; i < times; i++) {
      let count = 2;
      let probability;
      if (luck < 20) {
        probability = 0.1;
      } else {
        probability = Math.pow((luck - 20) / 150, 2) + 0.1;
      }
      if (Math.random() < probability) {
        // 双倍暴击
        count = count * 2;
      }
      for (const item of carriage) {
        // 工具双倍加成
        if (item.type === 'Tool' && item.name === 'Bow') {
          count = count * 3;
        }
        break;
      }
      totalNum += count;
    }

    const venison = new Food();
    venison.tokenId = foodInfo.venison.tokenId;
    venison.num = totalNum;
    // venison.activityId = activityId;
    await venison.mint(player.wallet);
    await venison.save();
    activity.status = 'ENDED';
    await activity.save();
    villager.activity = villager.activity.filter(act => act.id !== activity.id);
    await villager.save();
    return venison;
  }
  async finishExploring(villager, activity) {
    const { id: activityId, happiness, playerId } = activity;
    let { realLuck: luck, realStrength: strength, realEndurance: endurance } = villager;
    luck = luck * happiness / 100;
    strength = strength * happiness / 100;
    endurance = endurance * happiness / 100;
    // 力量决定探索次数=POWER(力量/120,2) *10+1
    const times = this.ctx.helper.randomTimes(Math.pow(strength / 120, 2) * 10 + 1);
    const chests = [];
    for (let i = 0; i < times; i++) {
      // 成功率=运气/200+(探索总时长-24)/2.5*0.02
      const hourUsed = (activity.dueTime - activity.startTime) / (3600 * 1000);
      const probability = luck / 200 + (hourUsed - 24) / 2.5 * 0.02;
      if (this.ctx.helper.randomBool(probability)) {
        // 成功获取宝箱
        const chest = new Chest();
        chest.opened = false;
        chest.activityId = activityId;
        chest.playerId = playerId;
        chests.push(chest);
      }
    }
    if (chests.length < 1) {
      // 一个宝箱都没得到，延期，再来一次
      // 总探索时常=SQRT（耐力*1.2）+24
      const hours = Math.sqrt(endurance * 1.2) + 24;
      activity.dueTime = new Date(activity.dueTime.getTime() + hours * 3600 * 1000);
      await activity.save();
      return [];
    }
    await Promise.all(chests.map(c => c.save()));
    activity.status = 'ENDED';
    await activity.save();
    villager.activity = villager.activity.filter(act => act.id !== activity.id);
    await villager.save();
    return chests;
  }

  // 获取所有物品，包括食物，返回结果为json object
  async getItemsInfo() {
    const foods = await Food.getFoodInfos(this.ctx.state.player.wallet);
    const items = (await Item.findByPlayerId(this.ctx.state.player.id)).map(i => i.toJson());
    return [ ...foods, ...items ];
  }
}
module.exports = ItemService;
