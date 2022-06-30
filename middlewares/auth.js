const jwt = require('jsonwebtoken');
const { MESSAGE } = require('../utils/errorsInfo');
const BadRequestError = require('../errors/badRequestErr');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new BadRequestError(MESSAGE.USER_UNAUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return new BadRequestError(MESSAGE.USER_UNAUTHORIZED);
  }

  req.user = payload;

  next();
};
