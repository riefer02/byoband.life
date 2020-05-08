const express = require('express');
const router = express.Router(); //Middleware, Sub-Application

const userController = require('./../controllers/userController');

//Data Management Routes
router.post('/register', userController.storeUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/update-profile-info', userController.updateProfileInfo);
router.post('/update-profile-picture', userController.updateProfilePicture);
router.get('/data', userController.getUserData);
// router.get(
// 	'/data-update-for-profile',
// 	userController.getUserDataPostUpdateProfile
// );

module.exports = router;
