'use strict';
module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.header['x-access-token'];
    if (!token) {
      ctx.throw('need token', 401);
    }
    // jwt decode
    try {
      const decoded = ctx.app.jwt.decode(token);
      ctx.state.user = JSON.parse(decoded);
    } catch (err) {
      ctx.throw(err.message, 401);
    }
    await next();
  };
};
