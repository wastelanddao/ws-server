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
        name: 'Adam',
        gender: 'MALE',
        tradable: false,
        inScene: true,
      });
      // init eve
      const eve = Villager.create({
        name: 'Eve',
        gender: 'FEMALE',
        tradable: false,
        inScene: true,
      });
      adam.tokenId = await adam.mint(player.wallet);
      eve.tokenId = await eve.mint(player.wallet);
      await Promise.all([
        adam.save(),
        eve.save(),
      ]);

      // init Hut
      const hut = Hut.create({
        location: 1,
      });
      hut.villagers = 2; // adam and eva

      // init Hall
      const hall = Hall.create({
        location: 2,
      });

      // init Portal
      const portal = Portal.create({
        location: 3,
      });

      // init Warehouse
      const warehouse = Warehouse.create({
        location: 4,
      });
      const [ hutId, hallId, portalId, warehouseId ] = await Promise.all([
        hut.mint(player.wallet),
        hall.mint(player.wallet),
        portal.mint(player.wallet),
        warehouse.mint(player.wallet),
      ]);
      hut.tokenId = hutId;
      hall.tokenId = hallId;
      portal.tokenId = portalId;
      warehouse.tokenId = warehouseId;
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
    const arr = await Villager.findByPlayerId(playerId);
    return arr.filter(item => item.inScene);
  }
}

module.exports = PlayerService;
