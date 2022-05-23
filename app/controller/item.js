'use strict';

const Controller = require('egg').Controller;
class ItemController extends Controller {
  async getItems() {
    const { ctx } = this;
    ctx.body = await ctx.service.item.getItemsInfo();
  }
}

module.exports = ItemController;
