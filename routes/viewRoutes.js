const express = require('express');

const router = express.Router(); //Middleware, Sub-Application

const authMiddleware = require('../middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');
const storeController = require('../controllers/storeController');
const viewController = require('../controllers/viewController');

// APPEND USER ID TO URL AS PARAM
const addParamsToURL = (req, res, next) => {
	const newURL = req.url.replace(':id', req.session.userID);
	req.url = newURL;
	req.params.id = req.session.userID;
	next();
};

//Page Routes
router.get('/', viewController.viewHomePage);
router.get('/update', authMiddleware, viewController.viewUpdateProfilePage);
router.get(
	'/profile/:id',
	authMiddleware,
	// storeController.updateUserTitle,
	addParamsToURL,
	viewController.viewUserProfile
);
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
router.get('/forgot-password', viewController.viewForgotPasswordPage);
router.get('/reset-password/:token', viewController.viewResetPasswordPage);

module.exports = router;
