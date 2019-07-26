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

module.exports = {
  HttpException,
  ParameterException,
  SuccessException,
}
