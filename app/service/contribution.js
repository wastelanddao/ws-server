'use strict';
const Service = require('egg').Service;
const Building = require('../model/building');
const Contribution = require('../model/contribution');
const Food = require('../model/food');
const Item = require('../model/item');
const Player = require('../model/player');
class ContributionService extends Service {
  async getByPlayerId(pid) {
    const Buildings = await Building.findByPlayerId(pid);
    return Buildings;
  }
  async contribute(items) {
    for (const item of items) {
      let { id, type, num } = item;
      const weightFire = 0;
      let weightEarth = 0;
      let weightMetal = 0;
      let weightWater = 0;
      let weightWood = 0;
      let tokenId;
      let basePoint = 0;
      switch (type) {
        case 'Food':
          weightEarth = 2;
          break;
        case 'Weapon':
          weightMetal = 3;
          break;
        case 'Dress':
          weightWood = 2;
          break;
        case 'Pet':
          weightWater = 1;
          weightWood = 2;
          break;
        default:
          throw new Error(`can not contribute for type ${type}`);
      }
      switch (type) {
        case 'Food':
          {
            const food = await Food.findById(id);
            if (food.owner !== this.ctx.state.user.wallet) {
              this.ctx.throw(403);
            }
            await food.burn(num);
            tokenId = food.tokenId;
            basePoint = food.happiness;
          }
          break;
        case 'Weapon':
        case 'Dress':
        case 'Pet':
          {
            const item = await Item.findById(id);
            const owner = await item.ownerOf();
            if (owner !== this.ctx.state.user.wallet) {
              this.ctx.throw(403);
            }
            await item.burn(owner);
            num = 1; // 721 num只能为1
            tokenId = item.tokenId;
            const { strength = 0, luck = 0, endurance = 0 } = item;
            basePoint = strength + luck + endurance;
          }
          break;

        default:
          break;
      }

      const contribute = new Contribution();
      contribute.contract = Food.getContractAddress();
      contribute.num = num;
      contribute.owner = this.ctx.state.user.wallet;
      contribute.tokenId = tokenId;
      contribute.fire = basePoint * weightFire;
      contribute.earth = basePoint * weightEarth;
      contribute.metal = basePoint * weightMetal;
      contribute.water = basePoint * weightWater;
      contribute.wood = basePoint * weightWood;
      await contribute.save();
    }
  }

  async getContributionByWallet(wallet) {
    if (!wallet) {
      throw new Error('need wallet');
    }
    const [ obj ] = await Contribution.findPlainObjByPipeline([
      {
        match: { owner: wallet },
      },
      {
        group: {
          objectId: null,
          fire: { $sum: '$fire' },
          earth: { $sum: '$earth' },
          metal: { $sum: '$metal' },
          water: { $sum: '$water' },
          wood: { $sum: '$wood' },
        },
      },
    ]);
    if (obj) {
      delete obj.objectId;
    }
    return obj;
  }
  async getContributionByPlayerId(pid) {
    const player = await Player.findById(pid);
    if (!player) {
      this.ctx.throw('player not found', 404);
    }
    return this.getContributionByWallet(player.wallet);
  }
}

module.exports = ContributionService;
