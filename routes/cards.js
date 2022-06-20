const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

// Роутинг данных карточки
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
