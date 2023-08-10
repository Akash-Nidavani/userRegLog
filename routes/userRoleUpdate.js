const express = require('express');
const router = express.Router();
const userController = require('../controllers/roleUpdate');

router.post('/rolechange/:id', userController.editRole)

module.exports = router;