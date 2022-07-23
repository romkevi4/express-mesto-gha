const { STATUS_CODE } = require('./responseInfo');

// Настройка опций для CORS
module.exports.optionsCors = {
  origin: [
    'http://localhost:3000',
    'localhost:3000',
    'https://mesto.shatskikh.nomoredomains.xyz',
    'http://mesto.shatskikh.nomoredomains.xyz',
  ],
  credentials: true,
  optionsSuccessStatus: STATUS_CODE.OK,
};
