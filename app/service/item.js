'use strict';
const Service = require('egg').Service;
const ItemFood = require('../model/item_food');
// const Activity = require('../model/activity');
class ItemService extends Service {
  async finishPicking(villager, activityId) {
    const { carriage } = villager;
    let count = 1;
    let strawberry = new ItemFood();
    carriage.forEach(item => {
      if (item.type === 'Tool' && item.category === 'Basket') {
        count = count * 2;
      }
    });
    strawberry = new ItemFood();
    // strawberry.type = 'Food';
    strawberry.name = 'strawberry';
    strawberry.num = count;
    strawberry.originalNum = count;
    strawberry.category = 'Fruits';
    strawberry.grade = 1;
    strawberry.activityId = activityId;
    strawberry.status = 'INSTOCK';
    await strawberry.save();
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
      if (item.type === 'Tool' && item.category === 'Bow') {
        count = count * 3;
      }
    });
    // venison.type = 'Food';
    venison.name = 'venison';
    venison.num = count;
    venison.originalNum = count;
    venison.category = 'Venison';
    venison.grade = 1;
    venison.status = 'INSTOCK';
    venison.activityId = activityId;
    await venison.save();
  }
  async finishExploring(villager, activityId) {
    console.log(villager, activityId);
  }
}
module.exports = ItemService;
