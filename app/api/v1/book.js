require('module-alias/register');
const Router = require('koa-router');
const { HotBook } = require('@models/hot-book');
const { Book } = require('@models/book');
const {
  Auth
} = require('../../../middlewares/auth');
const { Favor } = require('@models/favor');
const { Comment } = require('@models/book-comment');

const { HttpException, ParameterException } = require('../../../core/http-exception');
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator
} = require('../../validators/validator');

const { success } = require('../../lib/helper');

const router = new Router({
  prefix: '/v1/book',
});

// 获取热门图书
router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = books
});

// 获取图书详情
router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = new Book();
  ctx.body = await book.detail(v.get('path.id'));
})

// 根据关键词搜索图书
router.get('/search', async ctx=> {
  const v = await new SearchValidator().validate(ctx);
  const results = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'));
  ctx.body = results;
})

// GET: 我喜欢的图书数量
router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Favor.getMyFavorBookCount(ctx.auth.uid);
  ctx.body = {
    count
  }
})

// GET: 图书的点赞数量和我的点赞状态
router.get('/:book_id/favor', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id'
  });
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get('path.book_id'));
  ctx.body = favor;
})

// 增加短评
router.post('/add/short_comment', new Auth().m, async ctx => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: 'book_id'
  });
  await Comment.addComment(v.get('body.book_id'), v.get('body.content'))
  success('短评添加成功');
})

// 获取图书短评 by bookId
router.get('/:book_id/short_comment', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id',
  });
  const comments = await Comment.getComments(v.get('path.book_id'));

  ctx.body = {
    comments: comments,
    book_id: v.get('path.book_id'),
  }
})

// 获取热门搜索词（fake）
router.get('/hot_keyword', async (ctx) => {
  ctx.body = {
    'hot': [
      'Python',
      '哈利波特',
      '村上春树',
      '东野圭吾',
      '韩寒',
      '金庸',
      '王小波',
    ]
  }
});

module.exports = router;