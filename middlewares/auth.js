const basicAuth = require('basic-auth');
const { ForbiddenException } = require('../core/http-exception');
const jwt = require('jsonwebtoken');

class Auth {
  constructor(level) {
    // 实例属性
    this.level = level || 1;
    // 类变量
    Auth.USER = 8; // 普通用户
    Auth.ADMIN = 16; // 管理员
    Auth.SUPER_ADMIN = 32; // 超级管理员
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

      if (decode.scope < this.level) {
        throw new ForbiddenException('权限不足');
      }
      // 全局挂载 uid, scopt
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      }
      await next();
    }
  }

  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey);
      return true;
    }
    catch (error) {
      return false;
    }
  }
}

module.exports = {
  Auth
};
