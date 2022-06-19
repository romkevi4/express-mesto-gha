const User = require('../models/user');
const { ERROR_CODE, ERROR_MESSAGE } = require('../utils/errorsInfo');

// Возвращение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      res.status(ERROR_CODE.OK).send({ data: users });
    })
    .catch(err => {
      res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// Возвращение пользователя по _id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: user });
    })
    .catch(err => {
      if (err.path === '_id') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_ID });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => {
      res.status(ERROR_CODE.CREATED).send({ data: user });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_DATA });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Обновление профиля
module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true })
    .then(user => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: user });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_DATA });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Обновление аватара
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true })
    .then(user => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.USER_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: user });
    })
    .catch(err => {
      res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};