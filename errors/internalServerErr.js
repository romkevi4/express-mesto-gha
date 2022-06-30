const { STATUS_CODE } = require('../utils/errorsInfo');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
