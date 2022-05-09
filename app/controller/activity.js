'use strict';

const Controller = require('egg').Controller;
class ActivityController extends Controller {
  async getActivitys() {
    const { ctx } = this;
    const Activitys = await ctx.service.activity.getByPlayerId(ctx.state.user.id);
    ctx.body = Activitys.map(v => v.toJson());
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
