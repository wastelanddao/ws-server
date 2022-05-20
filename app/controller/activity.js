'use strict';

const Controller = require('egg').Controller;
const Item = require('../model/item');
const Chest = require('../model/chest');
const Food = require('../model/food');
class ActivityController extends Controller {
  async getActivitys() {
    const { ctx } = this;
    const Activitys = await ctx.service.activity.getByPlayerId(ctx.state.user.id);
    ctx.body = Activitys.map(v => v.toJson());
  }
  async getActivityById() {
    const { ctx } = this;
    const {
      activity,
      foods = [],
      villagers = [],
      chests = [],
    } = await ctx.service.activity.getActivityById(ctx.params.id);
    if (!activity) {
      return ctx.throw(`activity ${ctx.params.id} not found`, 404);
    }

    ctx.body = {
      activity: activity.toJson(),
      items: foods.map(i => ({
        ...i.toJsonWithInfo(),
        type: 'Food',
      })),
      chests: chests.map(c => c.toJson()),
      villagers: villagers.map(v => v.toJson()),
    };
  }
  async doActivity() {
    const { ctx } = this;
    const { villagerId, type } = ctx.request.body;
    if (!villagerId || !type) {
      ctx.throw('need villagerId and type', 400);
    }
    const villagerIds = Array.isArray(villagerId) ? villagerId : [ villagerId ];
    const act = await ctx.service.activity.doActivity(ctx.state.user.id, type, villagerIds);
    ctx.body = act.toJson();
  }
}

module.exports = ActivityController;
