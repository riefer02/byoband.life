<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router(); //Middleware, Sub-Application

const viewController = require('./../controllers/viewController');

//Page Routes
router.get('/', viewController.viewHomePage);
router.get('/update', viewController.viewUpdateProfilePage);
router.get('/profile', viewController.viewUserProfile);
router.get('/register', viewController.viewRegisterPage);
router.get('/login', viewController.viewLoginPage);
router.get('/new', viewController.viewCreatePostPage);

module.exports = router;
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
