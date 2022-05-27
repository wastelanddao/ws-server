'use strict';

const Building = require('../model/building');

const Controller = require('egg').Controller;
class BuildingController extends Controller {
  async getBuildings() {
    const { ctx } = this;
    const buildings = await this.service.building.getByPlayerId(ctx.state.user.id);
    ctx.body = buildings.map(v => {
      const ret = v.toJson();
      return ret;
    });
  }
  async doProduction() {
    const { ctx } = this;
    const workplace = await Building.findById(ctx.params.id);
    const production = await this.service.production.doProduction(workplace);
    ctx.body = production.toJson();
  }
  async getProduction() {
    const { ctx } = this;
    const workplaceId = ctx.params.id;
    const { production, items } = await this.service.production.getProductionByWorkplaceId(workplaceId);
    ctx.body = {
      ...production.toJson(),
      items: items.map(item => item.toJson()),
    };
  }
}

module.exports = BuildingController;
