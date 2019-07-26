const basicAuth = require('basic-auth');

class Auth {
  constructor() {

  }
  // m 是一个属性，并不是一个方法；
  get m() {
    return async (ctx, next) => {
      // 检测 token
      // HTTP Basic Authorization
      const token = basicAuth(ctx.req);
      ctx.body = {
        token
      }
    }
  }
}

module.exports = {
  Auth
};
