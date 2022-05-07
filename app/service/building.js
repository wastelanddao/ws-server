'use strict';
const Service = require('egg').Service;
// const Player = require('../model/player');
const Building = require('../model/base/building');
// const Hut = require('../model/building_Hut');
class BuildingService extends Service {
  async getByPlayerId(pid) {
    const Buildings = await Building.findByPlayerId(pid);
    return Buildings;
  }
}

module.exports = BuildingService;
