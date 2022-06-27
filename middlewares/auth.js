const jwt = require('jsonwebtoken');
const { ERROR_CODE, ERROR_MESSAGE } = require('../utils/errorsInfo');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ERROR_CODE.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGE.USER_UNAUTHORIZED });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(ERROR_CODE.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGE.USER_UNAUTHORIZED });
  }

  req.user = payload;

  next();
};