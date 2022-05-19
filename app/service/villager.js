'use strict';
const Service = require('egg').Service;
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
    return true;
  }
}

module.exports = VillagerService;
