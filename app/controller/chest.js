'use strict';

const Controller = require('egg').Controller;
class ChestController extends Controller {
  async getUnopenedChests() {
    const { ctx } = this;
    const chests = await ctx.service.chest.getUnopenedChests();
    this.ctx.body = chests.map(c => c.toJson());
  }
  async getChest() {
    let {
      chest,
      item,
      food,
      villager,
    } = await this.ctx.service.chest.getChest(this.ctx.params.id);
    if (!chest) {
      this.ctx.throw('chest not found', 404);
    }
    chest = chest.toJson();
    item = item ? item.toJson() : undefined;
    food = food ? food.toItem() : undefined;
    this.ctx.body = {
      ...chest,
      villager,
      item: item || food,
      building: undefined, // 预留，暂时需求没有开出building的情况
    };
  }
}

module.exports = ChestController;
