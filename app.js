const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();


mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62af32dd26518edb89b1c6bb'
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});