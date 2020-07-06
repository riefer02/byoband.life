const express = require('express');

const router = express.Router(); //Middleware, Sub-Application

const blogController = require('../controllers/blogController');

const validateMiddleWare = require('../middleware/validationMiddleware');

router.get('/data', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/store', validateMiddleWare, blogController.createBlogPost);
router.patch('/like-post/:id', blogController.likeBlogPost);

module.exports = router;
