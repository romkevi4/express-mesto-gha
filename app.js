const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const { createUser, login } = require('../controllers/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { STATUS_CODE, MESSAGE } = require('./utils/errorsInfo');
// const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  res
    .status(STATUS_CODE.NOT_FOUND)
    .send({ message: MESSAGE.PATH_NOT_FOUND });
  // throw new NotFoundError(MESSAGE.PATH_NOT_FOUND);

  next();
});

app.use((err, req, res, next) => {
  const { statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODE.INTERNAL_SERVER_ERROR
        ? MESSAGE.SERVER_ERROR
        : message
    });
});

app.listen(PORT);
