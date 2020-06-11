const path = require('path');
const crypto = require('crypto');

const User = require('../models/User');
const Email = require('../utils/email');

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
	const user = await User.findOne({
		$or: [{ username: username }, { email: username }],
	}).select('+password'); // NORMAL PASSWORD NOT ALLOWED IN OUTPUT, EXPLICITLY SELECT IT USING '+'.

	if (!user || !(await user.correctPassword(password, user.password))) {
		req.flash(msg);
		return res.render('login', {
			msg: 'Incorrect username or password',
		});
	}

	req.session.userID = user._id;
	global.loggedIn = req.session.userID;
	res.redirect('/');
};

exports.logoutUser = (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

exports.storeUser = async (req, res, next) => {
	await User.create(req.body, async (error, user) => {
		if (error) {
			const validationErrors = Object.keys(error.errors).map(
				(key) => error.errors[key].message
			);
			req.flash('validationErrors', validationErrors);
			req.flash('data', req.body);
			return res.redirect('/register');
		}
		const url = `${req.protocol}://${req.get('host')}/`;

		await new Email(user, url).sendWelcome();
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
		message: 'Here are your users sir.',
		data: {
			users,
		},
	});
};

exports.updateProfile = async (req, res, next) => {
	// NEXT GET IMAGES AND EMAIL TO CHANGE/UPLOAD TO DATABASE -->
	const { image } = req.files;

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
	const { image } = req.files;

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
	try {
		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/reset-password/${resetToken}`;
		await new Email(user, resetURL).sendPasswordReset();

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
		const redirect = { redirect: '/' };
		return res.json(redirect);
	}
	const redirect = { redirect: '/login' };
	return res.json(redirect);
};

exports.updatePassword = async (req, res, next) => {
	try {
		const passwordCurrent = req.body.password;

		// 1) Get User from Collection
		const user = await User.findById(req.session.userID).select('+password');

		// 2) Check if posted Current password matches current password
		if (!user.correctPassword(passwordCurrent, user.password)) {
			return res.status(404).render('updateProfile', {
				msg: 'Unable to validate password please try again.',
			});
		}

		// 3) If so update password
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		await user.save();

		// 4) Log user back in
		req.session.userID = user._id;
		return res.render('profile', {
			user,
		});
	} catch (err) {
		return res.status(404).render('updateProfile', {
			msg: 'Unable to validate password please try again.',
		});
	}
};

// FUNCTIONALITY NEEDS TO BE FINISHED
exports.deleteUser = async (req, res, next) => {
	await User.findByIdAndUpdate({ _id: req.session.userID }, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

exports.viewOtherUserProfile = async (req, res, next) => {
	try {
		const user = await User.findOne(req.params, (err, user) => {
			//
		});
		const { image, bio, role, username } = user;
		res.status(200).render('otherProfile', {
			image,
			bio,
			role,
			username,
		});
	} catch (error) {
		console.log(`Here is the error sir: ${error}.`);
	}
};
