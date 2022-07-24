const { STATUS_CODE, MESSAGE } = require('../utils/responseInfo');

module.exports.handleErrors = (err, req, res, next) => {
  const { statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODE.INTERNAL_SERVER_ERROR
        ? MESSAGE.SERVER_ERROR
        : message,
    });

  next();
};
