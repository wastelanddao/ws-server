'use strict';

const Controller = require('egg').Controller;
class VillagerController extends Controller {
  async getVillagers() {
    const { ctx } = this;
    const villagers = await ctx.service.player.getInSceneVillagerByPlayerId(ctx.state.user.id);
    ctx.body = villagers.map(v => v.toJson());
  }
}

module.exports = VillagerController;
