const basicAuth = require('basic-auth');
const { ForbiddenException } = require('../core/http-exception');
const jwt = require('jsonwebtoken');

class Auth {
  constructor() {

  }
  // m 是一个属性，并不是一个方法；
  get m() {
    return async (ctx, next) => {
      // 检测 token
      // HTTP Basic Authorization
      const userToken = basicAuth(ctx.req);

      if (!userToken || !userToken.name) {
        throw new ForbiddenException('没有token');
      }

      try {
        var decode = jwt.verify(userToken.name, global.config.security.secretKey);
      } catch (error) {
        console.log(error);
        // token 非法
        // token 过期
        if (error.name == 'TokenExpiredError') {
          throw new ForbiddenException('token 已过期');
        } else {
          throw new ForbiddenException('token 非法');
        }
      }
      // 全局挂载 uid, scopt
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      }
      await next();
    }
  }
}

module.exports = {
  Auth
};
