const express = require('express');
const router = express.Router();
const userController = require('../controllers/userLogout');

router.get('/logout', userController.userLogout)

module.exports = router;