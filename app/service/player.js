'use strict';
const Service = require('egg').Service;
const Moralis = require('moralis/node');
const Player = require('../model/player');
class PlayerService extends Service {
  async initPlayer(user) {
    const query = new Moralis.Query(Player);
    query.equalTo('wallet', user.attributes.ethAddress);
    let player = await query.first({ useMasterKey: true });
    if (!player) {
      player = Player.fromUser(user);
      await player.save();
    }
    return player;
  }

  async getPlayerById(pid) {
    const query = new Moralis.Query(Player);
    query.equalTo('objectId', pid);
    const player = await query.first({ useMasterKey: true });
    return player;
  }
}

module.exports = PlayerService;
