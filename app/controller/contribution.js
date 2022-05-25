'use strict';

const Controller = require('egg').Controller;
class ContributionController extends Controller {
  async contribute() {
    const { ctx } = this;
    const { items } = ctx.request.body;
    await ctx.service.contribution.contribute(items);
    const contribution = await ctx.service.contribution.getContributionByWallet(ctx.state.user.wallet);
    ctx.body = contribution;
  }
  async getContribute() {
    const { ctx } = this;
    const playerId = ctx.params.id;
    let contribution;
    if (playerId === ctx.state.user.id) {
      contribution = await ctx.service.contribution.getContributionByWallet(ctx.state.user.wallet);
    }
    contribution = await ctx.service.contribution.getContributionByPlayerId(playerId);
    ctx.body = contribution;
  }
}

module.exports = ContributionController;
