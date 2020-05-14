const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const path = require('path');
const validator = require('validator');
const crypto = require('crypto');
const axios = require('axios');

const User = require('../models/User');
const sendEmail = require('./../utils/email');

//Login user and return session ID
exports.loginUser = async (req, res) => {
	let msg;
	const { username, password } = req.body;

	// CHECK IF USER PROVIDED AN EMAIL OR PASSWORD
	if (!username || !password) {
		req.flash(msg);
		return res.render('login', {
			msg: 'Please enter username and password',
		});
	}

	// CHECK IF USER EXISTS AND PASSWORD IS CORRECT
	const user = await User.findOne({ username }).select('+password'); // NORMAL PASSWORD NOT ALLOWED IN OUTPUT, EXPLICITLY SELECT IT USING '+'.

	if (!user || !(await user.correctPassword(password, user.password))) {
		req.flash(msg);
		return res.render('login', {
			msg: 'Incorrect username or password',
		});
	}
	req.session.userID = user._id;
	res.redirect('/');

	// await User.findOne({ username: username }, (error, user) => {
	// 	if (user) {
	// 		bcrypt.compare(password, user.password, (error, same) => {
	// 			console.log('checking');
	// 			if (same) {
	// console.log('conclusion 1');
	// req.session.userID = user._id;
	// res.redirect('/');
	// 			} else if (error) {
	// 				console.log('conclusion 2');
	// 				res.redirect('/login');
	// 			}
	// 		});
	// 	} else {
	// 		req.flash(msg);
	// 		res.render('login', {
	// 			msg: 'Incorrect username and password',
	// 		});
	// 	}
	// });
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
	let image = req.files.image;
	// const data = {};

	let user = await User.findById(req.session.userID);

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
		// res.redirect('/users/data-update-for-profile');
		res.render('profile', {
			user,
		});
	});
};

exports.updateProfileInfo = async (req, res, next) => {
	console.log(req.body);
	const data = {};

	// APPENDS FORM INPUTS TO DATA OBJECT IF PRESENT
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
	// QUERIES FOR USER
	let user = await User.findById(req.session.userID);

	// UPDATES USER DOCUMENT IF DATA EXISTS
	if (!data.username === false) {
		await user.updateOne({ username: data.username });
	}
	if (!data.email === false) await user.updateOne({ email: data.email });
	if (!data.bio === false) await user.updateOne({ bio: data.bio });

	//QUERIES FOR USER WITH UPDATED PROPERTY VALUES AND ASSIGNS TO USER VAR
	const updatedUser = await User.findById(req.session.userID);
	user = updatedUser;

	//SAVES USER DOCUMENT IN DATABASE AND RETURNS VALUES TO PROFILE PAGE
	user.save(function () {
		res.render('profile', {
			user,
		});
	});
};

exports.updateProfilePicture = async (req, res, next) => {
	var image = req.files.image;

	let user = await User.findById(req.session.userID);

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
		res.redirect('/profile/:id');
	});
};

exports.forgotPassword = async (req, res, next) => {
	// FIND USER BY POSTED ((GET)) EMAIL
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		res.status(404).redirect('/reset-password', {
			msg: 'User does not exist',
		});
	}

	// GENERATE RANDOM RESET TOKEN
	const resetToken = user.createPasswordResetToken();

	// SAVES USER BUT TURNS OFF VALIDATORS ON THE MODEL
	await user.save({ validateBeforeSave: false });

	// SEND RESET TOKEN BY EMAIL
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/reset-password/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your Password Reset Token. (Valid for 10 Minutes)',
			message,
		});

		res.status(200).redirect('/');
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		res.status(500).redirect('/');
	}
};

exports.resetPassword = async (req, res, next) => {
	// 1) GET USER BASED ON TOKEN
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.body.token)
		.digest('hex');

	// CHECK IF THERE IS A USER OR THE TOKEN HAS EXPIRED, IF IT HAS EXPIRED WILL RETURN NO USER
	const user = await User.findOne({
		passwordResetToken: hashedToken,
	});

	// 2) IF TOKEN HAS EXPIRE || NO USER, SET THE PASSWORD
	if (!user) {
		res.redirect(400, '/password-reset/:token');
	}

	// TAKES THE USERS NEW PASSWORD INPUT AND UPDATES IT ACROSS THE DOCUMENT
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	// 3) UPDATED changedPasswordAt PROPERTY FOR THE USER

	// 4) LOG THE USER IN
	req.session.userID = user._id;
	// return res.redirect('/');

	if (user) {
		let redirect = { redirect: '/' };
		return res.json(redirect);
	} else {
		let redirect = { redirect: '/login' };
		return res.json(redirect);
	}
};
