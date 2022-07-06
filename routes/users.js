const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getUserData,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');
const { urlRegex } = require('../utils/urlRegex');

// Роутинг данных пользователя
router.get('/', getUsers);
router.get('/me', getUserData);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .length(24)
      .hex()
      .required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .min(2)
      .max(30)
      .required(),
    about: Joi.string()
      .min(2)
      .max(30)
      .required(),
  }),
}), updateUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(urlRegex)
      .required(),
  }),
}), updateUserAvatar);

module.exports = router;
