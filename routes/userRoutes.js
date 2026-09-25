const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
} = require('../controllers/userController');

router.route('/')
  .post(createUser)
  .get(getUsers);

router.route('/:id')
  .get(getUserById);

module.exports = router;
