const Router = require('koa-router');
const router = new Router({
  prefix: '/v1/user',
});
const {
  RegisterValidator
} = require('../../validators/validator');

const { User } = require('../../models/user');

// user 注册
router.post('/register', async (ctx) => {
  // 1. api 需要接受的参数
  // 2. 参数校验
  const v = await new RegisterValidator().validate(ctx);

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.nickname'),
  }

  const r = await User.create(user);
})

module.exports = router;
