'use strict';
const Service = require('egg').Service;
const Player = require('../model/player');
class PlayerService extends Service {
  async initPlayer(user) {
    let player = await Player.getByWallet(user.ethAddress);
    if (!player) {
      player = Player.fromUser(user);
      await player.save();
    }
    return player;
  }

  async getPlayerById(pid) {
    const player = await Player.findById(pid);
    return player;
  }
}

module.exports = PlayerService;
