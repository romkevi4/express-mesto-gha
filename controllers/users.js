const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_CODE,
  MESSAGE,
  MONGO_CODE,
  SALT_HASH,
} = require('../utils/responseInfo');
const BadRequestError = require('../errors/badRequestErr');
const UnauthorizedError = require('../errors/unauthorizedErr');
const NotFoundError = require('../errors/notFoundErr');
const ConflictError = require('../errors/conflictErr');

// Возвращение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
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
      if (err.path === '_id' || err.name === 'CastError') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_ID));
      } else {
        next(err);
      }
    });
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

  User.findOne({ email })
    .then((userSaved) => {
      if (!userSaved) {
        bcrypt.hash(password, SALT_HASH.ROUNDS)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
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
                },
              });
          });
      } else {
        throw new ConflictError(MESSAGE.ERROR_DUPLICATE_EMAIL_USER);
      }
    })
    .catch((err) => {
      if (err.code === MONGO_CODE.ERROR_DUPLICATE) {
        next(new ConflictError(MESSAGE.ERROR_DUPLICATE_EMAIL_USER));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

// Авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );

      if (!token) {
        throw new UnauthorizedError(MESSAGE.DATA_UNAUTHORIZED);
      }

      res.send({ token });
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
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
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
