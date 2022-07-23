const { STATUS_CODE } = require('../utils/responseInfo');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.NOT_FOUND;
  }
}

module.exports = NotFoundError;
