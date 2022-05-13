'use strict';
const Service = require('egg').Service;
const Chest = require('../model/chest');
const ItemFood = require('../model/item_food');
// const Activity = require('../model/activity');
class ItemService extends Service {
  async finishPicking(villager, activity) {
    const { id: activityId } = activity;
    const { carriage = [] } = villager;
    let count = 1;
    let strawberry = new ItemFood();
    carriage.forEach(item => {
      if (item.type === 'Tool' && item.category === 'Basket') {
        count = count * 2;
      }
    });
    strawberry = new ItemFood();
    strawberry.name = 'strawberry';
    strawberry.num = count;
    strawberry.originalNum = count;
    strawberry.category = 'Fruits';
    strawberry.grade = 1;
    strawberry.activityId = activityId;
    strawberry.status = 'INSTOCK';
    await strawberry.save();
    activity.status = 'ENDED';
    await activity.save();
    return true;
  }
  async finishHunting(villager, activity) {
    const { id: activityId, happiness } = activity;
    let { carriage = [], realLuck: luck, realStrength: strength } = villager;
    luck = luck * happiness / 100;
    strength = strength * happiness / 100;
    const venison = new ItemFood();
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
        if (item.type === 'Tool' && item.category === 'Bow') {
          count = count * 3;
        }
        break;
      }
      totalNum += count;
    }

    // venison.type = 'Food';
    venison.name = 'venison';
    venison.num = totalNum;
    venison.originalNum = totalNum;
    venison.category = 'Venison';
    venison.grade = 1;
    venison.status = 'INSTOCK';
    venison.activityId = activityId;
    await venison.save();
    activity.status = 'ENDED';
    await activity.save();
    return true;
  }
  async finishExploring(villager, activity) {
    const { id: activityId, happiness } = activity;
    let { realLuck: luck, realStrength: strength, realEndurance: endurance } = villager;
    luck = luck * happiness / 100;
    strength = strength * happiness / 100;
    endurance = endurance * happiness / 100;
    // 力量决定探索次数=POWER(力量/120,2) *10+1
    const times = this.ctx.helper.randomTimes(Math.pow(strength / 120, 2));
    const chests = [];
    for (let i = 0; i < times; i++) {
      // 成功率=运气/200+(探索总时长-24)/2.5*0.02
      const hourUsed = (activity.dueTime - activity.startTime) / (3600 * 1000);
      const probability = luck / 200 + (hourUsed - 24) / 2.5 * 0.02;
      if (this.ctx.helper.randomBool(probability)) {
        // 成功获取宝箱
        const chest = new Chest();
        // todo: 宝箱颜色随机算法
        chest.color = 'GRAY';
        chest.opened = false;
        chest.activityId = activityId;
        chests.push(chest);
      }
    }
    if (chests.length < 1) {
      // 一个宝箱都没得到，延期，再来一次
      // 总探索时常=SQRT（耐力*1.2）+24
      const hours = Math.sqrt(endurance * 1.2) + 24;
      activity.dueTime = new Date(activity.dueTime.getTime() + hours * 3600 * 1000);
      await activity.save();
      return false;
    }
    await Promise.all(chests.map(c => c.save()));
    activity.status = 'ENDED';
    await activity.save();
    return true;
  }
}
module.exports = ItemService;
