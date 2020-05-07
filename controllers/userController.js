const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const path = require('path');
const validator = require('validator');

//Login user and return session ID
exports.loginUser = async (req, res) => {
	const { username, password } = req.body;
	await User.findOne({ username: username }, (error, user) => {
		if (user) {
			bcrypt.compare(password, user.password, (error, same) => {
				if (same) {
					req.session.userID = user._id;
					res.redirect('/');
				} else if (error) {
					res.redirect('/login');
				}
			});
		} else {
			res.redirect('/login');
		}
	});
};

exports.logoutUser = (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

exports.storeUser = async (req, res, next) => {
	await User.create(req.body, async (error, user) => {
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

//Returns JSON of Blogs from DB
exports.getUserData = async (req, res, next) => {
	const users = await User.find({});

	res.header('application/json');
	res.status(404).json({
		message: 'Here are your blogs sir.',
		data: {
			users,
		},
	});
};

exports.updateProfile = async (req, res, next) => {
	// NEXT GET IMAGES AND EMAIL TO CHANGE/UPLOAD TO DATABASE -->
	var image = req.files.image;
	const data = {};

	if (req.body.username === '' || undefined) {
		delete req.body.username;
	} else {
		data.username = req.body.username.trim();
	}

	if (req.body.email === '' || undefined) {
		delete req.body.email;
	} else {
		data.email = req.body.email.trim();
	}

	if (req.body.bio === '' || undefined) {
		delete req.body.bio;
	} else {
		data.bio = req.body.bio.trim();
	}

	let user = await User.findById(req.session.userID);

	if (!data.username === false) {
		await user.updateOne({ username: data.username });
	}
	if (!data.email === false) await user.updateOne({ email: data.email });
	if (!data.bio === false) await user.updateOne({ bio: data.bio });
	if (image) {
		image.mv(
			path.resolve(__dirname, '..', 'public/img', image.name),
			async (error) => {
				await user.updateOne({ image: '/img/' + image.name });
			}
		);
	}

	const updatedUser = await User.findById(req.session.userID);
	user = updatedUser;

	user.save(function () {
		res.render('profile', {
			user,
		});
	});
};
