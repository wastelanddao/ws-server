'use strict';

const Building = require('../model/building');
const Food = require('../model/food');
const food_info = require('../model/food_info');
const Production = require('../model/production');

const Service = require('egg').Service;
class ProductionService extends Service {
  async doProduction(workplace) {
    const { status = 'INUSE' } = workplace;
    if (status !== 'INUSE') {
      throw new Error('workplace is working or instock');
    }
    const now = new Date();
    const production = new Production();
    production.playerId = this.ctx.state.player.id;
    production.startTime = now;
    production.status = 'STARTED';
    production.workplaceId = workplace.id;
    let days;
    // let outputFoodTokenId;
    // let outputNum;
    let inputFoodTokenId;
    let inputNum;
    switch (workplace.subType) {
      case 'Farm':
        days = 1;
        // outputFoodTokenId = food_info.grain.tokenId;
        // outputNum = 10;
        inputFoodTokenId = undefined;
        inputNum = 0;
        break;
      case 'Mill':
        days = 2;
        // outputFoodTokenId = food_info.flour.tokenId;
        // outputNum = 20;
        inputFoodTokenId = food_info.grain.tokenId;
        inputNum = 20;
        break;
      case 'Bakery':
        days = 2;
        // outputFoodTokenId = food_info.bread.tokenId;
        // outputNum = 10;
        inputFoodTokenId = food_info.flour.tokenId;
        inputNum = 20;
        break;
      case 'Swine Farm':
        days = 2;
        // outputFoodTokenId = food_info.pork_chop.tokenId;
        // outputNum = 20;
        inputFoodTokenId = food_info.grain.tokenId;
        inputNum = 20;
        break;
      case 'Butcher\'s':
        days = 2;
        // outputFoodTokenId = food_info.sausage.tokenId;
        // outputNum = 10;
        inputFoodTokenId = food_info.pork_chop.tokenId;
        inputNum = 20;
        break;
      case 'Bonfire':
        days = 2;
        // outputFoodTokenId = food_info.roast_venison.tokenId;
        // outputNum = 10;
        inputFoodTokenId = food_info.venison.tokenId;
        inputNum = 20;
        break;
      default:
        throw new Error('sub type wrong');
    }
    if (inputNum) {
      const input = Food.createFromTokenId(inputFoodTokenId, this.ctx.state.player.wallet);
      await input.burn(inputNum);
    }
    production.dueTime = new Date(now.getTime() + days * 24 * 3600 * 1000);
    await production.save();
    workplace.status = 'WORKING';
    await workplace.save();
    return production;
  }

  async finishProduction(production) {
    const workplace = await Building.findById(production.workplaceId);
    if (!workplace) {
      throw new Error('work place not found');
    }
    if (production.status === 'STARTED'
    // && new Date() > production.dueTime
    ) {
      let outputFoodTokenId;
      let outputNum;
      switch (workplace.subType) {
        case 'Farm':
          outputFoodTokenId = food_info.grain.tokenId;
          outputNum = 10;
          break;
        case 'Mill':
          outputFoodTokenId = food_info.flour.tokenId;
          outputNum = 20;
          break;
        case 'Bakery':
          outputFoodTokenId = food_info.bread.tokenId;
          outputNum = 10;
          break;
        case 'Swine Farm':
          outputFoodTokenId = food_info.pork_chop.tokenId;
          outputNum = 20;
          break;
        case 'Butcher\'s':
          outputFoodTokenId = food_info.sausage.tokenId;
          outputNum = 10;
          break;
        case 'Bonfire':
          outputFoodTokenId = food_info.roast_venison.tokenId;
          outputNum = 10;
          break;
        default:
          throw new Error('sub type wrong');
      }
      const output = await Food.getOrCreate(this.ctx.state.player.wallet, outputFoodTokenId);
      await output.mint(outputNum);
      output.num = outputNum;
      production.status = 'ENDED';
      workplace.status = 'INUSE';
      await Promise.all([
        production.save(),
        workplace.save(),
      ]);
      return output;
    }
  }

  async getProductionByWorkplaceId(workplaceId) {
    const [ production ] = await Production.findByEqual({
      workplaceId,
    });
    if (!production) {
      this.ctx.throw('production not found', 404);
    }
    const output = await this.finishProduction(production);
    return {
      production,
      items: output ? [ output ] : [],
    };
  }
}

module.exports = ProductionService;
