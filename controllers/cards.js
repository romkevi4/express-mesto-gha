const Card = require('../models/card');
const { ERROR_CODE, ERROR_MESSAGE } = require('../utils/errorsInfo');

// Возвращение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      res.status(ERROR_CODE.OK).send({ data: cards });
    })
    .catch(err => {
      res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then(card => {
      res.status(ERROR_CODE.CREATED).send({ data: card });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_DATA });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then(card => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.CARD_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: card });
    })
    .catch(err => {
      if (err.path === '_id') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_ID });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Добавление лайка карточке
module.exports.addLikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then(card => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.CARD_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: card });
    })
    .catch(err => {
      if (err.path === '_id') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_ID });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Удаление лайка у карточки
module.exports.removeLikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then(card => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.CARD_NOT_FOUND });
        return;
      }

      res.status(ERROR_CODE.OK).send({ data: card });
    })
    .catch(err => {
      if (err.path === '_id') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: ERROR_MESSAGE.ERROR_INCORRECT_ID });

      } else {
        res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};