const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { MESSAGE } = require('../utils/errorsInfo');

// Схема для данных пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: MESSAGE.EMAIL_INCORRECT,
    },
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(MESSAGE.USER_UNAUTHORIZED));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(MESSAGE.USER_UNAUTHORIZED));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
