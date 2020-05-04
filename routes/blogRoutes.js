const express = require('express');
const router = express.Router(); //Middleware, Sub-Application
const blogController = require('./../controllers/blogController');
// const userController = require('./../controllers/userController');

router.get('/blogs', blogController.getBlogPosts);

module.exports = router;
