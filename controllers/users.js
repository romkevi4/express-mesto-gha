const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODE, ERROR_MESSAGE } = require('../utils/errorsInfo');

// Возвращение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users })
    .catch((err) => {
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: err.ERROR_MESSAGE });
    }));
};

// Возвращение пользователя по _id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.path === '_id') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.ERROR_INCORRECT_ID });
      } else {
        res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

// Проверка логина и пароля
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }
      );

      res.send({ data: token });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
        .end();
    })
    .catch(() => {
      res
        .status(ERROR_CODE.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGE.USER_UNAUTHORIZED });
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(ERROR_CODE.CREATED)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.ERROR_INCORRECT_DATA });
      } else {
        res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

// Обновление профиля
module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.ERROR_INCORRECT_DATA });
      } else {
        res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

// Обновление аватара
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
