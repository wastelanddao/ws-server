'use strict';
const Service = require('egg').Service;
const Item = require('../model/item');
const Player = require('../model/player');
// const Player = require('../model/player');
const Villager = require('../model/villager');
// const Hut = require('../model/building_Hut');
class VillagerService extends Service {
  async getByPlayerId(pid) {
    const villagers = await Villager.findByPlayerId(pid);
    return villagers;
  }
  async finishPregnant(activity) {
    const { playerId, villagerId: motherId, happiness } = activity;
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error('player not found');
    }
    const [ father, mother ] = await Promise.all([
      Villager.findOwnById(activity.extraInfo.fatherId, playerId),
      Villager.findOwnById(motherId, playerId),
    ]);
    const child = new Villager();
    child.name = '';
    child.motherId = motherId;
    child.fatherId = activity.extraInfo.fatherId;
    child.gender = Math.random() < 0.5 ? 'MALE' : 'FEMALE';
    child.birthTime = new Date().getTime();
    let percent = 0.35;
    if (happiness === 100) {
      percent = 0.65;
    }
    child.strength = Math.round((father.strength + mother.strength) * percent);
    child.luck = Math.round((father.luck + mother.luck) * percent);
    child.endurance = Math.round((father.endurance + mother.endurance) * percent);
    child.traits = {
      eye: 0,
      eyebrow: 0,
      ear: 0,
      nose: 0,
      mouth: 0,
    };
    child.tradable = true;
    child.carriage = [];
    child.activity = [];
    const refreshPopulationCapacity = await this.service.player.refreshPopulationCapacity(playerId);
    const inSceneVillager = await this.service.player.getInSceneVillagerByPlayerId(playerId);
    child.inScene = inSceneVillager.length < refreshPopulationCapacity;
    child.tokenId = await child.mint(player.wallet);
    await child.save();
    activity.status = 'ENDED';
    await activity.save();
    mother.activity = mother.activity.filter(act => act.id !== activity.id);
    await mother.save();
    return child;
  }
  async carryItems(villagerId, ...itemIds) {
    const [ villager ] = await Villager.findByWallet(this.ctx.state.user.wallet, {
      includes: 'carriage',
      filter: { objectId: villagerId },
    });
    if (!villager) {
      this.ctx.throw(`villager ${villagerId} not found`);
    }
    const itemInfos = await Item.findPlainObjByPipeline([
      {
        match: {
          objectId: { $in: itemIds },
        },
      },
    ]);
    for (const itemInfo of itemInfos) {
      if (itemInfo.villagerId) {
        throw new Error(`item ${itemInfo.objectId} already be carried`);
      }
      if (this.ctx.state.user.wallet !== await Item.ownerOf721(itemInfo.tokenId)) {
        throw new Error(`item ${itemInfo.objectId} not belong to you`);
      }
      const item = new Item();
      item.id = itemInfo.objectId;
      item.villagerId = villagerId;
      item.status = 'CARRIED';
      await item.save();
      villager.carriage.push(item);
    }
    // 去重
    const newCarriage = [];
    villager.carriage.reduce((set, item) => {
      if (!set.has(item.id)) {
        set.add(item.id);
        newCarriage.push(item);
      }
      return set;
    }, new Set());
    villager.carriage = newCarriage;
    await villager.save();
  }
  async unCarryItems(villagerId, ...itemIds) {
    const [ villager ] = await Villager.findByWallet(this.ctx.state.user.wallet, {
      includes: 'carriage',
      filter: { objectId: villagerId },
    });
    if (!villager) {
      this.ctx.throw(`villager ${villagerId} not found`);
    }
    const itemInfos = await Item.findPlainObjByPipeline([
      {
        match: {
          objectId: { $in: itemIds },
        },
      },
    ]);
    for (const itemInfo of itemInfos) {
      if (itemInfo.villagerId !== villagerId) {
        throw new Error(`item ${itemInfo.objectId} not carried by villager ${villagerId}`);
      }
      const item = new Item();
      item.id = itemInfo.objectId;
      item.villagerId = null;
      item.status = 'INSTOCK';
      await item.save();
      villager.carriage = villager.carriage.filter(c => c.id !== item.id);
    }
    await villager.save();
  }
  // 获取villager穿戴的item，支持批量查询
  async getCarriage(...villagerId) {
    const items = await Item.findByIn('villagerId', villagerId);
    return items;
  }
}

module.exports = VillagerService;
