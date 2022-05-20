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
      items = [],
      foods = [],
      villagers = [],
    } = await this.ctx.service.chest.getChest(this.ctx.params.id);
    if (!chest) {
      this.ctx.throw('chest not found', 404);
    }
    chest = chest.toJson();
    items = items.map(i => i.toJson());
    foods = foods.map(f => ({
      ...f.toJsonWithInfo(),
      type: 'Food',
    }));
    villagers = villagers.map(v => ({
      ...v.toJson(),
      type: 'Villager',
    }));
    this.ctx.body = {
      ...chest,
      items: [ ...items, ...villagers, ...foods ],
    };
  }
}

module.exports = ChestController;
