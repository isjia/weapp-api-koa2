const Router = require('koa-router');
const router = new Router();
const { HttpException, ParameterException } = require('../../../core/http-exception');
const { PositiveIntegerValidator } = require('../../validators/validator');

router.get('/v1/book/latest', (ctx, next) => {
  // do something
  ctx.body = {
    classic: 'book/latest'
  }
  // const error = new HttpException('an error message', 1001, 500);
  const error = new ParameterException('缺少参数', 10001);
  // error.errCode = 1001;
  // error.message = 'an error';
  // error.status = 500;
  // error.reqUrl = ctx.method + ': ' + ctx.path;
  throw error;
});

router.post('/v1/:id/book/latest', (ctx, next) => {
  const v = new PositiveIntegerValidator().validate(ctx);
  const path = ctx.params;
  const query = ctx.request.query;
  const header = ctx.request.header;
  const body = ctx.request.body
  ctx.body = {
    path: `/v1/${path.id}/book/latest`,
    body: ctx.request.body,
  }
});

module.exports = router;