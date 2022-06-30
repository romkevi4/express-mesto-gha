const { STATUS_CODE } = require('../utils/errorsInfo');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
