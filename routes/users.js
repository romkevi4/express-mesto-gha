const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

// Роутинг данных пользователя
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
