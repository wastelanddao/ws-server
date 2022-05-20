'use strict';
const Service = require('egg').Service;
// const Activity = require('../model/activity');
// const Player = require('../model/player');
const Chest = require('../model/chest');
const Food = require('../model/food');
const food_info = require('../model/food_info');
const Item = require('../model/item');
const Villager = require('../model/villager');
class ChestService extends Service {
  async getUnopenedChests() {
    const player = this.ctx.state.user;
    const chests = await Chest.findByEqual({
      playerId: player.id,
      opened: false,
    });
    return chests;
  }

  async getChest(id) {
    const player = this.ctx.state.user;
    const chest = await Chest.findOwnById(id, player.id);
    if (chest && !chest.opened) {
      const { chest: chest1, items, foods, villagers } = await this.openChest(chest);
      return {
        chest: chest1,
        items,
        foods,
        villagers,
      };
    }
    return { chest };
  }
  async openChest(chest) {
    if (chest.opened) {
      return chest;
    }
    const activityId = chest.activityId;
    const chests = await Chest.findByActivityId(activityId);
    const hasOpened = chests.filter(c => c.opened).sort((a, b) => (a.openedAt > b.openedAt ? 1 : -1));
    const [ lastOpened ] = hasOpened;
    /**
     * 高级宝箱的开出几率为 =POWER(当前第几个宝箱/30,2) *10
        每个高级宝箱的开出几率会逐步增加，开出了则回到0
     */
    const order = hasOpened.length + 1;
    const chestProbability = lastOpened && lastOpened.isGreen ? 0 : Math.pow(order / 30, 2) * 10;
    const isGreen = this.ctx.helper.randomBool(chestProbability);
    chest.color = isGreen ? 'GREEN' : 'GRAY';
    chest.opened = true;
    chest.openedAt = new Date();

    const { helper } = this.ctx;
    // 计算宝箱开出的物品
    let villagerRatio,
      petRatio,
      foodRatio,
      equipRatio;
    let villagerAttrRange = [];
    let petAttrRange = [];
    let equipAttrRange = [];
    switch (chest.color) {
      case 'GRAY':
        villagerRatio = 5 / 100;
        petRatio = 5 / 100;
        foodRatio = 50 / 100;
        equipRatio = 40 / 100;
        villagerAttrRange = [ 1, 50 ];
        petAttrRange = [ 15, 20 ];
        equipAttrRange = [ 1, 10 ];
        break;
      case 'GREEN':
        villagerRatio = 30 / 100;
        petRatio = 10 / 100;
        foodRatio = 30 / 100;
        equipRatio = 30 / 100;
        villagerAttrRange = [ 40, 100 ];
        petAttrRange = [ 20, 25 ];
        equipAttrRange = [ 10, 20 ];
        break;
      case 'ORANGE':
        villagerRatio = 50 / 100;
        petRatio = 30 / 100;
        foodRatio = 10 / 100;
        equipRatio = 10 / 100;
        villagerAttrRange = [ 70, 120 ];
        petAttrRange = [ 25, 35 ];
        equipAttrRange = [ 20, 30 ];
        break;
      default:
        throw new Error('wrong color');
    }
    const ret = {};
    if (helper.randomBool(villagerRatio)) {
      // 村民
      const villager = new Villager();
      villager.gender = helper.randomBool(0.5) ? 'MALE' : 'FEMALE';
      villager.name = '';
      villager.birthTime = 0;
      villager.strength = helper.randomRangInt(villagerAttrRange);
      villager.luck = helper.randomRangInt(villagerAttrRange);
      villager.endurance = helper.randomRangInt(villagerAttrRange);
      villager.inScene = false;
      villager.traits = {};
      villager.tradable = true;
      await villager.mint(this.ctx.state.user.wallet);
      await villager.save();
      ret.villagers = [ villager ];
    } else if (helper.randomBool(petRatio)) {
      // pet
      const item = new Item();
      item.type = 'Pet';
      // item.activityId = activityId;
      item.name = 'little dog';
      item.num = 1;
      item.quality = helper.randomRangInt(petAttrRange);
      item.strength = helper.randomRangInt(petAttrRange);
      item.luck = helper.randomRangInt(petAttrRange);
      item.endurance = helper.randomRangInt(petAttrRange);
      item.durability = 20;
      item.status = 'INSTOCK';
      await item.mint(this.ctx.state.user.wallet);
      await item.save();
      ret.items = [ item ];
    } else if (helper.randomBool(equipRatio)) {
      // 装备
      const item = new Item();
      const [ type, name ] = helper.randomSelect([[ 'Weapon', '雷神之锤' ], [ 'Dress', '锁子甲' ]]);
      item.type = type;
      item.name = name;
      // item.activityId = activityId;
      item.num = 1;
      item.quality = helper.randomRangInt(equipAttrRange);
      item.strength = helper.randomRangInt(equipAttrRange);
      item.luck = helper.randomRangInt(equipAttrRange);
      item.endurance = helper.randomRangInt(equipAttrRange);
      item.durability = 20;
      item.status = 'INSTOCK';
      await item.mint(this.ctx.state.user.wallet);
      await item.save();
      ret.items = [ item ];
    } else {
      // food
      foodRatio;
      const food = new Food();
      // food.activityId = activityId;
      food.tokenId = food_info.venison.tokenId;
      food.num = helper.randomRangInt([ 5, 10 ]);
      food.tradable = true;
      await food.mint(this.ctx.state.user.wallet);
      await food.save();
      ret.foods = [ food ];
    }
    await chest.save();
    ret.chest = chest;
    return ret;
  }
}

module.exports = ChestService;
