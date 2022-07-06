const Card = require('../models/card');
const { STATUS_CODE, MESSAGE } = require('../utils/errorsInfo');
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
        throw new BadRequestError(MESSAGE.ERROR_INCORRECT_DATA);
      } else {
        next(err);
      }
    })
    .catch(next);
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      }

      if (_id !== card.owner._id) {
        throw new ForbiddenError(MESSAGE.ERROR_DELETE_CARD);
      }

      res
        .status(STATUS_CODE.OK)
        .send({ data: card });
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

// Добавление лайка карточке
module.exports.addLikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      }

      res.send({ data: card });
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

// Удаление лайка у карточки
module.exports.removeLikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE.CARD_NOT_FOUND);
      }

      res.send({ data: card });
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
