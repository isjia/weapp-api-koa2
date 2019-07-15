const Router = require('koa-router');
const router = new Router();

router.get('/v1/classic/latest', (ctx, next) => {
  // do something
  ctx.body = {
    classic: 'classic/latest'
  }
});

module.exports = router;