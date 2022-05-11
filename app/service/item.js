'use strict';
const Service = require('egg').Service;
const ItemFood = require('../model/item_food');
const Activity = require('../model/Activity');
class ItemService extends Service {
  async finishPicking(villager, activityId) {
    const { carriage } = villager;
    let count = 1;
    let strawberry = new ItemFood();
    carriage.forEach(item => {
      if (item.type === 'Tool' && item.name === 'basket') {
        count = count * 2;
      }
    });
    strawberry = new ItemFood();
    strawberry.type = 'Food';
    strawberry.name = 'strawberry';
    strawberry.num = count;
    strawberry.activityId = activityId;
    strawberry.status = 'CARRIED';
    await strawberry.save();
    const activityObj = new Activity();
    activityObj.id = activityId;
    activityObj.status = 'ENDED';
    await activityObj.save();
  }
  async finishHunting(villager, activityId) {
    const { carriage, luck } = villager;
    const venison = new ItemFood();
    let count = 2;
    let probability;
    if (luck < 20) {
      probability = 0.1;
    } else {
      probability = Math.pow((luck - 20) / 150, 2) + 0.1;
    }
    if (Math.random() < probability) {
      count = count * 2;
    }
    carriage.forEach(item => {
      if (item.type === 'Tool' && item.name === 'bow') {
        count = count * 3;
      }
    });
    venison.type = 'Food';
    venison.name = 'venison';
    venison.num = count;
    venison.status = 'CARRIED';
    venison.activityId = activityId;
    await venison.save();
    const activityObj = new Activity();
    activityObj.id = activityId;
    activityObj.status = 'ENDED';
    await activityObj.save();
  }
  async finishExploring(villager, activityId) {

  }
}
module.exports = ItemService;
