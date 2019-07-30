require('module-alias/register');

const Router = require('koa-router');
const { Auth } = require('../../../middlewares/auth');
const { Flow } = require('../../models/flow');
const { Art } = require('../../models/art');
const { Favor } = require('@models/favor');

const router = new Router({
  prefix: '/v1/classic',
});

router.get('/latest', new Auth().m, async (ctx, next) => {
  // do something
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC'],
    ],
  })
  const art = await Art.getData(flow.art_id, flow.type);
  const favor = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue('index', flow.index);
  art.setDataValue('like_status', favor);
  ctx.body = art;
});

module.exports = router;
