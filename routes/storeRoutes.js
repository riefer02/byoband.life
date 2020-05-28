const express = require('express');
const router = express.Router(); //Middleware, Sub-Application
const storeController = require('./../controllers/storeController');

const authMiddleware = require('./../middleware/authMiddleware');

router.get(
	'/checkout-session/:title',
	authMiddleware,
	storeController.getCheckoutSession
);

router.get('/upgrade-title', authMiddleware, storeController.titleStore);

module.exports = router;
