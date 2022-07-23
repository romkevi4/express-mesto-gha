const Card = require('../models/card');
const { STATUS_CODE, MESSAGE } = require('../utils/responseInfo');
const BadRequestError = require('../errors/badRequestErr');
const ForbiddenError = require('../errors/forbiddenErr');
const NotFoundError = require('../errors/notFoundErr');

// Возвращение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => {
      res
        .status(STATUS_CODE.CREATED)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card || !cardId) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      } else if (_id === card.owner.toString()) {
        Card.findByIdAndDelete(cardId)
          .then(() => {
            res
              .status(STATUS_CODE.OK)
              .send({ data: card });
          });
      } else {
        throw new ForbiddenError(MESSAGE.ERROR_DELETE_CARD);
      }
    })
    .catch((err) => {
      if (err.path === '_id' || err.name === 'CastError') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_ID));
      } else {
        next(err);
      }
    });
};

// Добавление лайка карточке
module.exports.addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.path === '_id') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_ID));
      } else {
        next(err);
      }
    });
};

// Удаление лайка у карточки
module.exports.removeLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.path === '_id') {
        next(new BadRequestError(MESSAGE.ERROR_INCORRECT_ID));
      } else {
        next(err);
      }
    });
};
