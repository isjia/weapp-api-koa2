const Router = require('koa-router');
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator');
const {
  generateToken,
} = require('../../../core/util');

const router = new Router({
  prefix: '/v1/token',
});

const { LoginType } = require('../../lib/enum');

const { ParameterException } = require('../../../core/http-exception');
const { User } = require('../../models/user');
const { WXManager } = require('../../service/wx');
const { Auth } = require('../../../middlewares/auth');

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx);
  let token = '';
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get('body.account'), v.get('body.secret'));
      ctx.body = {
        token,
      }
      break;
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get('body.account'));
      break;
    default:
      throw new ParameterException('登录类型不存在');
  }
  ctx.body = {
    token,
  }
});

router.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx);

  const result = Auth.verifyToken(v.get('body.token'));

  ctx.body = {
    result,
  }
})

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);
  const token = generateToken(user.id, Auth.USER);
  return token;
}

module.exports = router;