const Koa = require('koa');

const InitManager = require('./core/init');

const app = new Koa(); // 应用程序对象

InitManager.initCore(app);

app.listen(3000);
