const Router = require('koa-router');
// const bcrypt = require('bcryptjs');

const { success } = require('../../lib/helper'); 

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
  // const salt = bcrypt.genSaltSync(10);
  // const pwd = bcrypt.hashSync(v.get('body.password1'), salt);
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.nickname'),
  }

  const r = await User.create(user);
  success('账号创建成功', 0);
})

module.exports = router;
