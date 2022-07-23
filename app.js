require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { urlRegex } = require('./utils/urlRegex');
const { STATUS_CODE, MESSAGE } = require('./utils/responseInfo');
const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3001, MONGO_DB } = process.env;
const { optionsCors } = require('./utils/optionsCors');

const app = express();

app.use('*', cors(optionsCors));

mongoose.connect(MONGO_DB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .min(2)
      .max(30),
    avatar: Joi
      .string()
      .pattern(urlRegex),
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  }),
}), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError(MESSAGE.PATH_NOT_FOUND));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODE.INTERNAL_SERVER_ERROR
        ? MESSAGE.SERVER_ERROR
        : message,
    });

  next();
});

app.listen(PORT);
