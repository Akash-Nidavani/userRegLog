const express = require('express');
const router = express.Router();
const userController = require('../controllers/userLogin');

router.post('/login', userController.userLogin)

module.exports = router;