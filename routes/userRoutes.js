const express = require('express');
const router = express.Router(); //Middleware, Sub-Application

const userController = require('./../controllers/userController');

router.get('/updateProfile', userController.updateUserProfile);
router.get('/profile', userController.viewUserProfile);

module.exports = router;
