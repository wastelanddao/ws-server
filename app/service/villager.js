'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Villager = require('../model/villager');
// const Hut = require('../model/building_Hut');
class VillagerService extends Service {
  async getByPlayerId(pid) {
    const villagers = await Villager.findByPlayerId(pid);
    return villagers;
  }
}

module.exports = VillagerService;
