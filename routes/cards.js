const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');
const { urlRegex } = require('../utils/urlRegex');

// Роутинг данных карточек
router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .min(2)
      .max(30)
      .required(),
    link: Joi
      .string()
      .pattern(urlRegex)
      .required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .hex()
      .required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .hex()
      .required(),
  }),
}), addLikeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .hex()
      .required(),
  }),
}), removeLikeCard);

module.exports = router;
