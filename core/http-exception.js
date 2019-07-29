class HttpException extends Error {
  constructor (msg="server error", errCode=10000, status=400) {
    super();
    this.errCode = errCode;
    this.msg = msg;
    this.status = status;
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.status = 400;
    this.msg = msg || '参数错误';
    this.errCode = errorCode || 10000;
  }
}

class SuccessException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.status = 201;
    this.msg = msg || 'ok';
    this.errCode = errorCode || 0;
  }
}

// Not Found HttpException
class NotFoundException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.msg = msg || '资源未找到';
    this.errCode = errorCode || 10000;
    this.status = 404;
  }
}

//  Auth Failed HttpException
class AuthFailedException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.msg = msg || '授权失败';
    this.errCode = errorCode || 10000;
    this.status = 404;
  }
}

class ForbiddenException extends HttpException {
  constructor(msg, errorCode) {
    super();

    this.msg = msg || '禁止访问';
    this.errCode = errorCode || 10006;
    this.status = 403;
  }
}

class LikeException extends HttpException {
  constructor(msg, errorCode) {
    super();

    this.status = 400;
    this.msg = msg || '你已经点过赞了';
    this.errCode = errorCode || 60001;
  }
}

class DislikeException extends HttpException {
  constructor(msg, errorCode) {
    super();

    this.status = 400;
    this.msg = msg || '你已取消点赞';
    this.errCode = errorCode || 60002;
  }
}

module.exports = {
  HttpException,
  ParameterException,
  SuccessException,
  NotFoundException,
  AuthFailedException,
  ForbiddenException,
  LikeException,
  DislikeException,
}
