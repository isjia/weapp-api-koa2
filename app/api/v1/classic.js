require('module-alias/register');

const Router = require('koa-router');
const { Auth } = require('../../../middlewares/auth');
const { Flow } = require('../../models/flow');
const { Art } = require('../../models/art');
const { Favor } = require('@models/favor');
const { PositiveIntegerValidator } = require('@validators/validator');
const { NotFoundException } = require('@core/http-exception');

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

router.get('/:index/next', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  });

  const index = v.get('path.index');

  const flow = await Flow.findOne({
    where: {
      index: index + 1
    }
  });

  if (!flow) {
    throw new NotFoundException('没有找到下一期期刊');
  }

  // 返回下一期期刊的详情
  const art = await Art.getData(flow.art_id, flow.type);
  const favor = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue('index', flow.index);
  art.setDataValue('like_status', favor);
  ctx.body = art;
})

router.get('/:index/previous', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  });

  const index = v.get('path.index');

  const flow = await Flow.findOne({
    where: {
      index: index - 1
    }
  });

  if (!flow) {
    throw new NotFoundException('没有找到上一期期刊');
  }

  // 返回下一期期刊的详情
  const art = await Art.getData(flow.art_id, flow.type);
  const favor = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue('index', flow.index);
  art.setDataValue('like_status', favor);
  ctx.body = art;
})

module.exports = router;
