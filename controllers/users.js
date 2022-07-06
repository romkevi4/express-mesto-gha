const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { STATUS_CODE, MESSAGE, MONGO_CODE, SALT_HASH } = require('../utils/errorsInfo');
const BadRequestError = require('../errors/badRequestErr');
const UnauthorizedError = require('../errors/unauthorizedErr');
const NotFoundError = require('../errors/notFoundErr');
const ConflictError = require('../errors/conflictErr');
const InternalServerError = require('../errors/internalServerErr');

// Возвращение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new InternalServerError(MESSAGE.SERVER_ERROR);
      }

      res.send({ data: users });
    })
    .catch(next);
};

// Возвращение пользователя по _id
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.path === '_id') {
        throw new BadRequestError(MESSAGE.ERROR_INCORRECT_ID);
      } else {
        next(err);
      }
    })
    .catch(next);
};

// Получение данных о пользователе
module.exports.getUserData = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_HASH.ROUNDS)
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res
        .status(STATUS_CODE.CREATED)
        .send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          }
        });
    })
    .catch((err) => {
      if (err.code === MONGO_CODE.ERROR_DUPLICATE) {
        throw new ConflictError(MESSAGE.ERROR_DUPLICATE_EMAIL_USER);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA);
      } else {
        next(err);
      }
    })
    .catch(next);
};

// Проверка логина и пароля
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      if (!token) {
        throw new UnauthorizedError(MESSAGE.DATA_UNAUTHORIZED);
      }

      res.send({ token });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
    })
    .catch(next);
};

// Обновление профиля
module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA);
      } else {
        next(err);
      }
    })
    .catch(next);
};

// Обновление аватара
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
      }

      res.send({ data: user });
    })
    .catch(next);
};
