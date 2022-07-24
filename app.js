require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('./routes/index');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MESSAGE } = require('./utils/responseInfo');
const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3001, MONGO_DB = 'mongodb://localhost:27017/mestodb' } = process.env;
const { optionsCors } = require('./utils/optionsCors');

const app = express();

app.use('*', cors(optionsCors));

mongoose.connect(MONGO_DB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use(routes);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError(MESSAGE.PATH_NOT_FOUND));
});

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
