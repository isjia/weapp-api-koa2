const { HttpException } = require('../core/http-exception');

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 开发环境
    // 生产环境
    // 开发环境 不是HttpException
    const isHttpException = error instanceof HttpException
    const isDev = global.config.env === 'dev'

    if (isDev && !isHttpException) {
      throw error
    }

    if (isHttpException) {
      // 处理已知异常
      ctx.body = {
        msg: error.msg,
        errCode: error.errCode,
        reqUrl: `${ctx.method}: ${ctx.path}`,
      }
      ctx.status = error.status;
    }
    else {
      // 处理未知异常
      ctx.body = {
        msg: '出错啦！！！',
        errCode: 999,
        request: `${ctx.method}: ${ctx.path}`,
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError;
