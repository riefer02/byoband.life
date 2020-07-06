<<<<<<< HEAD
const express = require('express');

const router = express.Router(); //Middleware, Sub-Application

const blogController = require('../controllers/blogController');

const validateMiddleWare = require('../middleware/validationMiddleware');

router.get('/data', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/store', validateMiddleWare, blogController.createBlogPost);
router.patch('/like-post/:id', blogController.likeBlogPost);

module.exports = router;
=======
const express = require('express');
const router = express.Router(); //Middleware, Sub-Application
const blogController = require('./../controllers/blogController');
const viewController = require('./../controllers/viewController');

router.get('/data', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/store', blogController.createBlogPost);

module.exports = router;

// // ROUTES
// app.get('/', homeController);
// app.get('/post/:id', getPostController);
// app.get('/posts/new', authMiddleware, newPostController);
// app.post('/posts/store', authMiddleware, storePostController);

// app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
// app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
// app.post(
// 	'/users/register',
// 	redirectIfAuthenticatedMiddleware,
// 	storeUserController
// );
// app.post(
// 	'/users/login',
// 	redirectIfAuthenticatedMiddleware,
// 	loginUserController
// );
// app.get('/auth/logout', logoutController);
// app.use((req, res) => res.render('notfound'));
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
