const Router = require('koa-router');
const { TokenValidator } = require('../../validators/validator');
const {
  generateToken,
} = require('../../../core/util');

const router = new Router({
  prefix: '/v1/token',
});

const { LoginType } = require('../../lib/enum');

const { ParameterException } = require('../../../core/http-exception');
const { User } = require('../../models/user');

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx);
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL:
      const token = await emailLogin(v.get('body.account'), v.get('body.secret'));
      ctx.body = {
        token,
      }
      break;
    case LoginType.USER_MINI_PROGRAM:
      break;
    default:
      throw new ParameterException('登录类型不存在');
  }
});

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);
  const token = generateToken(user.id, 2);
  return token;
}

module.exports = router;