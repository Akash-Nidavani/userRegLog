const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blogController');

router.post('/',BlogController.createBlog);

module.exports = router;