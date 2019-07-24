const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app;
    InitManager.initLoadRouters();
    InitManager.loadConfig();
  }

  static initLoadRouters() {
    // 使用绝对路径
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    });

    function whenLoadModule(obj) {
      // 注册路由模块
      if (obj instanceof Router) {
        // console.log(obj);
        InitManager.app.use(obj.routes());
      }
    }
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js';
    const config = require(configPath);
    global.config = config
  }
}

module.exports = InitManager;
