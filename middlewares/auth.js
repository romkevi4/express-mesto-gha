const jwt = require('jsonwebtoken');
const { MESSAGE } = require('../utils/errorsInfo');
const UnauthorizedError = require('../errors/unauthorizedErr');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(MESSAGE.USER_UNAUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError(MESSAGE.USER_UNAUTHORIZED);
  }

  req.user = payload;

  next();
};
