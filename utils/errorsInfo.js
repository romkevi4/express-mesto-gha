module.exports.ERROR_CODE = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED:401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.ERROR_MESSAGE = {
  USER_NOT_FOUND: 'Запрашиваемый пользователь не найден',
  USER_UNAUTHORIZED: 'Пользователь не авторизован, введенные почта или пароль неправильные',
  ERROR_CREATE_USER: 'Переданные данные для создания нового пользователя не корректны',
  ERROR_UPDATE_USER: 'Переданные данные профиля пользователя не корректны',
  ERROR_UPDATE_AVATAR: 'Переданные данные аватара пользователя не корректны',
  CARD_NOT_FOUND: 'Запрашиваемая карточка не найдена',
  ERROR_CREATE_CARD: 'Переданные данные для создания новой карточки не корректны',
  ERROR_ADD_LIKE: 'Переданные данные для постановки лайка не корректны',
  ERROR_REMOVE_LIKE: 'Переданные данные для снятия лайка не корректны',
  ERROR_INCORRECT_ID: 'Введённый id не корректен',
  ERROR_INCORRECT_DATA: 'Введённые данные не корректны',
  PATH_NOT_FOUND: 'Запрашиваемый путь не найден',
  CORRECT: 'Все верно',
};
