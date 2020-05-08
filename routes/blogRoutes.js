const express = require('express');
const router = express.Router(); //Middleware, Sub-Application
const blogController = require('./../controllers/blogController');
const viewController = require('./../controllers/viewController');

const validateMiddleWare = require('./../middleware/validationMiddleware');

router.get('/data', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/store', validateMiddleWare, blogController.createBlogPost);

module.exports = router;
