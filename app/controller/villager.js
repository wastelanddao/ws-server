'use strict';

const Controller = require('egg').Controller;
class VillagerController extends Controller {
  async getVillagers() {
    const { ctx } = this;
    const villagers = await ctx.service.player.getInSceneVillagerByPlayerId(ctx.state.user.id);
    ctx.body = villagers.map(v => v.toJson());
  }
  async getVillagerCarriage() {
    const { ctx } = this;
    const items = await ctx.service.villager.getCarriage(ctx.params.id);
    ctx.body = items.map(v => v.toJson());
  }
  async carryItems() {
    const { ctx } = this;
    const itemIds = ctx.request.body;
    await ctx.service.villager.carryItems(ctx.params.id, ...itemIds);
    ctx.body = { count: 0 };
  }
  async unCarryItems() {
    const { ctx } = this;
    const itemIds = ctx.request.body;
    await ctx.service.villager.unCarryItems(ctx.params.id, ...itemIds);
    ctx.body = { count: 0 };
  }
}

module.exports = VillagerController;
