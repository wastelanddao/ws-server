'use strict';

const Controller = require('egg').Controller;
const Moralis = require('moralis/node');
const User = Moralis.User;
class AuthController extends Controller {
  async login() {
    const { ctx } = this;
    const { wallet, signature } = ctx.request.body;

    const query = new Moralis.Query(User);
    query.equalTo('ethAddress', wallet);
    const user = await query.first({ useMasterKey: true });

    if (!user) {
      ctx.throw('wallet address not found', 401);
    }
    const authData = user.get('authData');
    const { moralisEth } = authData;
    if (!moralisEth) {
      ctx.throw(500);
    }
    if (moralisEth.signature !== signature) {
      ctx.throw('wrong signature', 401);
    }
    const player = await ctx.service.player.initPlayer(user);
    const obj = player.toPlain();
    const jwtToken = ctx.app.jwt.sign(obj);
    ctx.res.setHeader('x-access-token', jwtToken);
    ctx.body = obj;
  }
}

module.exports = AuthController;
