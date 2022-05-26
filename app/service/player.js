'use strict';
const Service = require('egg').Service;
const Player = require('../model/player');
const Villager = require('../model/villager');
const Building = require('../model/building');
class PlayerService extends Service {
  async initPlayer(user) {
    let player = await Player.getByWallet(user.ethAddress);
    if (!player) {
      player = Player.fromUser(user);
      player.populationCapacity = 5;
      await player.save();

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
        const hut = new Building();
        hut.type = 'Hut';
        hut.subType = 'Hut';
        hut.location = 1;
        hut.villagers = 2; // adam and eva

        // init Hall
        const hall = new Building();
        hall.type = 'Hall';
        hall.subType = 'Hall';
        hall.location = 2;

        // init Portal
        const portal = new Building();
        portal.type = 'Portal';
        portal.subType = 'Portal';
        portal.location = 3;

        // init Warehouse
        const warehouse = new Building();
        warehouse.type = 'Warehouse';
        warehouse.subType = 'Warehouse';
        warehouse.location = 4;
        await Promise.all([
          hut.mint(player.wallet),
          hall.mint(player.wallet),
          portal.mint(player.wallet),
          warehouse.mint(player.wallet),
        ]);
        await Promise.all([
          hut.save(),
          hall.save(),
          portal.save(),
          warehouse.save(),
        ]);
      }
    }


    return player;
  }

  async getPlayerById(pid) {
    const player = await Player.findById(pid);
    return player;
  }

  async refreshPopulationCapacity(playerId) {
    // const player = await Player.findById(playerId);
    // const huts = await Hut.findByPlayerId(playerId);
    // player.populationCapacity = huts.length * 5;
    // await player.save();
    // return player.populationCapacity;
    // todo

    playerId;
    return 99999;
  }
  async getInSceneVillagerByPlayerId(playerId) {
    const arr = await Villager.findByPlayerId(playerId);
    return arr.filter(item => item.inScene);
  }
}

module.exports = PlayerService;
