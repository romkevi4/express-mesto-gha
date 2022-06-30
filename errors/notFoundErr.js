const { STATUS_CODE } = require('../utils/errorsInfo');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.NOT_FOUND;
  }
}

module.exports = NotFoundError;
