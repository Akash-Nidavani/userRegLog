const express = require('express');
const router = express.Router();
const userController = require('../controllers/userRegistration');

router.post('/reg', userController.userReg)

module.exports = router;