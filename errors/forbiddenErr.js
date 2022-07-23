const { STATUS_CODE } = require('../utils/responseInfo');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
