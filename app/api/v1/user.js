const Router = require('koa-router');
const router = new Router({
  prefix: '/v1/user',
});
const {
  RegisterValidator
} = require('../../validators/validator');

// user 注册
router.post('/register', async (ctx) => {
  // 1. api 需要接受的参数
  // 2. 参数校验
  const v = new RegisterValidator().validate(ctx);

})

module.exports = router;