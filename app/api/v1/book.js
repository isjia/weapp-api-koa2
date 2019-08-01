require('module-alias/register');
const Router = require('koa-router');
const { HotBook } = require('@models/hot-book');
const { Book } = require('@models/book');

const { HttpException, ParameterException } = require('../../../core/http-exception');
const { PositiveIntegerValidator } = require('../../validators/validator');

const router = new Router({
  prefix: '/v1/book',
});

// 获取热门图书
router.get('/hot-list', async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = {
    books,
  }
});

// 获取图书详情
router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = new Book(v.get('path.id'));
  ctx.body = await book.detail();
})

module.exports = router;