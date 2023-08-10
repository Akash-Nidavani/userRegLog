const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blogController');
const authorize = require("../middlewear/authorize.js")
const authenticate = require('../middlewear/authenticate');

router.post('/',authenticate,authorize(),BlogController.createBlog);
router.put('/:id',authenticate,authorize('Admin','Reviewer','Author'),BlogController.updateBlog);
router.put('/changestatus/:id',authenticate,authorize('Admin','Reviewer'),BlogController.changeStatusOfBlog);

module.exports = router;