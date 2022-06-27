const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const { login, createUser } = require('../controllers/users');
const cardsRouter = require('./routes/cards');
const { ERROR_CODE, ERROR_MESSAGE } = require('./utils/errorsInfo');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62af32dd26518edb89b1c6bb',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: ERROR_MESSAGE.PATH_NOT_FOUND });

  next();
});

app.listen(PORT);
