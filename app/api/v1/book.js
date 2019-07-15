const Router = require('koa-router');
const router = new Router();

router.get('/v1/book/latest', (ctx, next) => {
  // do something
  ctx.body = {
    classic: 'book/latest'
  }
});

module.exports = router;