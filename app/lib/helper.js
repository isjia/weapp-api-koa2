const { SuccessException } = require('../../core/http-exception');

function success(msg, errCode) {
  throw new SuccessException(msg, errCode);
}

module.exports = {
  success,
}
