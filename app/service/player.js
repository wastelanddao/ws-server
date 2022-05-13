'use strict';
const Service = require('egg').Service;
const Player = require('../model/player');
const Villager = require('../model/villager');
const Hut = require('../model/building_hut');
const Hall = require('../model/building_hall');
const Portal = require('../model/building_portal');
const Warehouse = require('../model/building_warehouse');
class PlayerService extends Service {
  async initPlayer(user) {
    let player = await Player.getByWallet(user.ethAddress);
    if (!player) {
      player = Player.fromUser(user);
      player.populationCapacity = 5;
      await player.save();
    }

    // init
    {
      // init adam
      const adam = Villager.create({
        playerId: player.id,
        name: 'Adam',
        gender: 'MALE',
        tradable: false,
        inScene: true,
      });
      // init eve
      const eve = Villager.create({
        playerId: player.id,
        name: 'Eve',
        gender: 'FEMALE',
        tradable: false,
        inScene: true,
      });
      await Promise.all([
        adam.save(),
        eve.save(),
      ]);

      // init Hut
      const hut = Hut.create({
        playerId: player.id,
        location: 1,
      });
      hut.villagers = 2; // adam and eva

      // init Hall
      const hall = Hall.create({
        playerId: player.id,
        location: 2,
      });

      // init Portal
      const portal = Portal.create({
        playerId: player.id,
        location: 3,
      });

      // init Warehouse
      const warehouse = Warehouse.create({
        playerId: player.id,
        location: 4,
      });

      await Promise.all([
        hut.save(),
        hall.save(),
        portal.save(),
        warehouse.save(),
      ]);
    }
    return player;
  }

  async getPlayerById(pid) {
    const player = await Player.findById(pid);
    return player;
  }

  async refreshPopulationCapacity(playerId) {
    const player = await Player.findById(playerId);
    const huts = await Hut.findByPlayerId(playerId);
    player.populationCapacity = huts.length * 5;
    await player.save();
    return player.populationCapacity;
  }
  async getInSceneVillagerByPlayerId(playerId) {
    return await Villager.findByPipeline([{
      match: {
        playerId,
        inScene: true,
      },
    }]);
  }
}

module.exports = PlayerService;
