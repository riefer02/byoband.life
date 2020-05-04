const User = require('../models/User');

exports.updateUserProfile = (req, res) => {
	res.status(200).render('updateProfile');
};

exports.viewUserProfile = (req, res) => {
	res.status(200).render('profile');
};
