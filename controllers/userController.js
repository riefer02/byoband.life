const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const path = require('path');

//Login user and return session ID
exports.loginUser = (req, res, next) => {
	const { username, password } = req.body;

	User.findOne({ username: username }, (error, user) => {
		console.log('check');
		if (user) {
			bcrypt.compare(password, user.password, (error, same) => {
				if (same) {
					req.session.userID = user._id;
					res.redirect('/');
				} else if (error) {
					res.redirect('/users/login');
				}
			});
		} else {
			res.redirect('/users/login');
		}
	});
};

exports.logoutUser = (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

exports.storeUser = async (req, res, next) => {
	console.log(req.body);
	User.create(req.body, async (error, user, next) => {
		if (error) {
			console.log(error);
			const validationErrors = Object.keys(error.errors).map(
				(key) => error.errors[key].message
			);
			req.flash('validationErrors', validationErrors);
			req.flash('data', req.body);
			return res.redirect('/register');
		}

		req.session.userID = user._id;
		global.loggedIn = req.session.userID;
		return res.redirect('/');
	});
};
