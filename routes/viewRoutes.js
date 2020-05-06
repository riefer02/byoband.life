const express = require('express');
const router = express.Router(); //Middleware, Sub-Application

const viewController = require('./../controllers/viewController');

const authMiddleware = require('./../middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./../middleware/redirectIfAuthenticatedMiddleware');

//Page Routes
router.get('/', viewController.viewHomePage);
router.get('/update', authMiddleware, viewController.viewUpdateProfilePage);
router.get('/profile/:id', authMiddleware, viewController.viewUserProfile);
router.get(
	'/register',
	redirectIfAuthenticatedMiddleware,
	viewController.viewRegisterPage
);
router.get(
	'/login',
	redirectIfAuthenticatedMiddleware,
	viewController.viewLoginPage
);
router.get('/new', authMiddleware, viewController.viewCreatePostPage);
router.get('/reset-password', viewController.viewResetPasswordPage);

module.exports = router;
