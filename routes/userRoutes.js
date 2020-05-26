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

router.post('/forgot-password', userController.forgotPassword); //Sends email with reset token
router.patch('/reset-password/:token', userController.resetPassword); //Updates and saves new password
router.post('/update-current-password', userController.updatePassword);

//ROUTE TO BE DEVELOPED
router.delete('/delete-user', userController.deleteUser);

module.exports = router;
