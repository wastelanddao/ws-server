'use strict';

const Controller = require('egg').Controller;
const Item = require('../model/base/item');
const Chest = require('../model/chest');
class ActivityController extends Controller {
  async getActivitys() {
    const { ctx } = this;
    const Activitys = await ctx.service.activity.getByPlayerId(ctx.state.user.id);
    ctx.body = Activitys.map(v => v.toJson());
  }
  async getActivityById() {
    const { ctx } = this;
    const activity = await ctx.service.activity.getActivityById(ctx.params.id);
    if (!activity) {
      return ctx.throw(`activity ${ctx.params.id} not found`, 404);
    }
    const [ items, chests ] = await Promise.all([
      Item.findByActivityId(activity.id),
      Chest.findByActivityId(activity.id),
    ]);

    ctx.body = {
      activity: activity.toJson(),
      items: items.map(i => i.toJson()),
      chests: chests.map(c => c.toJson()),
    };
  }
  async doActivity() {
    const { ctx } = this;
    const { villagerId, type } = ctx.request.body;
    const villagerIds = Array.isArray(villagerId) ? villagerId : [ villagerId ];
    const act = await ctx.service.activity.doActivity(ctx.state.user.id, type, ...villagerIds);
    ctx.body = act.toJson();
  }
}

module.exports = ActivityController;
