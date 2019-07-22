const { HttpException } = require('../core/http-exception');

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) {
      ctx.body.msg = error.msg;
      ctx.body.errCode = error.errCode;
      ctx.body.reqUrl = `${ctx.method}: ${ctx.path}`;
      ctx.status = error.status;
    }
    // ctx.body = 'error msg';
  }
}

module.exports = catchError;
