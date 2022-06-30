const jwt = require('jsonwebtoken');
const { STATUS_CODE, MESSAGE } = require('../utils/errorsInfo');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .send({ message: MESSAGE.USER_UNAUTHORIZED });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .send({ message: MESSAGE.USER_UNAUTHORIZED });
  }

  req.user = payload;

  next();
};