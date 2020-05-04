const User = require('../models/User.js');
const path = require('path');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
	User.create(req.body, async (error, user, next) => {
		if (error) {
			console.log(error);
			const validationErrors = Object.keys(error.errors).map(
				(key) => error.errors[key].message
			);
			req.flash('validationErrors', validationErrors);
			req.flash('data', req.body);
			return res.redirect('/auth/register');
		}

		req.session.userID = user._id;
		global.loggedIn = req.session.userID;
		return res.redirect('/');
	});
};
