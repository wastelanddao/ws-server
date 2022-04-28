'use strict';

const Controller = require('egg').Controller;
// const Moralis = require('moralis/node');
class PlayerController extends Controller {
  async getPlayer() {
    const { ctx } = this;
    const player = await ctx.service.player.getPlayerById(ctx.params.id);
    if (!player) {
      ctx.throw('not found', 404);
    }
    ctx.body = player.toPlain();
  }
}

module.exports = PlayerController;
