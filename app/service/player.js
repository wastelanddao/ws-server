'use strict';
const Service = require('egg').Service;
const Player = require('../model/player');
const Villager = require('../model/villager');
class PlayerService extends Service {
  async initPlayer(user) {
    let player = await Player.getByWallet(user.ethAddress);
    if (!player) {
      player = Player.fromUser(user);
      await player.save();
      // init adam
      const adam = Villager.create({
        playerId: player.id,
        name: 'Adam',
        gender: 'MALE',
      });
      await adam.save();
      // init eve
      const eve = Villager.create({
        playerId: player.id,
        name: 'Eve',
        gender: 'FEMALE',
      });
      await eve.save();
    }
    return player;
  }

  async getPlayerById(pid) {
    const player = await Player.findById(pid);
    return player;
  }
}

module.exports = PlayerService;
