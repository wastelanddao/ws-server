'use strict';
module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.logger.error(err);
      ctx.status = err.status || err.statusCode || 500;
      ctx.body = {
        code: ctx.status,
        message: err.message || 'error',
      };
    }
  };
};
