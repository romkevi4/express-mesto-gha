// Статус-код ответов сервера
module.exports.STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Сообщения ответов сервера
module.exports.MESSAGE = {
  USER_NOT_FOUND: 'Запрашиваемый пользователь не найден',
  USER_UNAUTHORIZED: 'Пользователь не авторизован',
  USER_EXIT: 'Пользователь вышел из системы',
  ERROR_CREATE_USER: 'Переданные данные для создания нового пользователя не корректны',
  ERROR_UPDATE_USER: 'Переданные данные профиля пользователя не корректны',
  ERROR_UPDATE_AVATAR: 'Переданные данные аватара пользователя не корректны',
  ERROR_DUPLICATE_EMAIL_USER: 'Пользователь с таким email уже зарегистрирован',
  CARD_NOT_FOUND: 'Запрашиваемая карточка не найдена',
  ERROR_CREATE_CARD: 'Переданные данные для создания новой карточки не корректны',
  ERROR_ADD_LIKE: 'Переданные данные для постановки лайка не корректны',
  ERROR_REMOVE_LIKE: 'Переданные данные для снятия лайка не корректны',
  ERROR_DELETE_CARD: 'Удаление карточки другого пользователя запрещено',
  ERROR_INCORRECT_ID: 'Введённый id не корректен',
  ERROR_INCORRECT_DATA: 'Введённые данные не корректны',
  PATH_NOT_FOUND: 'Запрашиваемый путь не найден',
  EMAIL_INCORRECT: 'Введенный email не корректен',
  URL_INCORRECT: 'Введенный url не корректен',
  SERVER_ERROR: 'На сервере произошла ошибка',
  DATA_UNAUTHORIZED: 'Введенные почта или пароль неправильные',
  CORRECT: 'Всё верно',
};

// Код ошибки дублирования email в Mongo
module.exports.MONGO_CODE = {
  ERROR_DUPLICATE: 11000,
};

// Длина соли для хеша
module.exports.SALT_HASH = {
  ROUNDS: 10,
};
