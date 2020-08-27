var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var blog_controller = require('../controllers/blogController');

/// BLOG ROUTERS ///

//display number of users and messages
router.get('/', blog_controller.index);

//display message list
router.get('/home', blog_controller.list_blog);

/// USER ROUTERS ///
router.get('/signup', user_controller.sign_up_get);

router.post('/signup', user_controller.sign_up_post);

router.get('/login', user_controller.login);

module.exports = router;