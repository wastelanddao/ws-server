'use strict';

const Controller = require('egg').Controller;
class BuildingController extends Controller {
  async getBuildings() {
    const { ctx } = this;
    const buildings = await this.service.building.getByPlayerId(ctx.state.user.id);
    ctx.body = buildings.map(v => {
      const ret = v.toJson();
      ret.villagers = v.villagers ? v.villagers.length : 0;
      return ret;
    });
  }
}

module.exports = BuildingController;
