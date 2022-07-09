const winston = require('winston');
const expressWinston = require('express-winston');

// Сохранение логов запросов к API
module.exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// Сохранение логов возвращаемых ошибок от API
module.exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
