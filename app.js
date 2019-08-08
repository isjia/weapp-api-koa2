const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const InitManager = require('./core/init');
const catchError = require('./middlewares/exception');


const app = new Koa(); // 应用程序对象

app.use(bodyParser());
app.use(catchError);
app.use(static(path.join(__dirname,'./static')))

InitManager.initCore(app);

app.listen(3000);
