'use strict';

const Controller = require('egg').Controller;
class PlayerController extends Controller {
  async getPlayer() {
    const { ctx } = this;
    const player = await ctx.service.player.getPlayerById(ctx.params.id);
    if (!player) {
      ctx.throw('not found', 404);
    }
    let contribution;
    if (player) {
      contribution = await this.ctx.service.contribution.getContributionByWallet(player.wallet);
    }
    ctx.body = {
      ...player.toJson(),
      contribution,
    };
  }
}

module.exports = PlayerController;
