const BlogPost = require('../models/BlogPost.js');
const User = require('../models/User');

// Populate all Blogposts on Home Page
exports.viewHomePage = async (req, res, next) => {
	//FIND AND POPULATE ALL BLOGPOSTS TO HOME PAGE
	const blogposts = await BlogPost.find({}).populate('userid');

	if (req.session.userID === undefined) {
		res.status(200).render('index', {
			blogposts,
		});
		// IF USER IS LOGGED IN HENCE SESSION ID EXISTS REVEAL WELCOME MESSAGE
	} else if (typeof req.session.userID === 'string') {
		let user = await User.findById(req.session.userID);

		res.status(200).render('index', {
			blogposts,
			user,
		});
	}
};

// To Login Page
exports.viewLoginPage = (req, res, next) => {
	msg = null;
	res.render('login', {
		msg,
	});
};

//Go to Post Page
exports.viewCreatePostPage = (req, res, next) => {
	if (req.session.userID) {
		return res.render('create', {
			createPost: true,
		});
	} else {
		res.redirect('/login');
	}
};

//Go to update profile page
exports.viewUpdateProfilePage = (req, res, next) => {
	res.status(200).render('updateProfile');
};

//view a users profile page
exports.viewUserProfile = async (req, res, next) => {
	const user = await User.findOne({ _id: req.params.id });
	res.status(200).render('profile', {
		user,
	});
};

//Go to register New User Page
exports.viewRegisterPage = (req, res, next) => {
	let username = '';
	let password = '';
	let email = '';
	let passwordConfirm = '';

	const data = req.flash('data')[0];
	if (typeof data !== 'undefined') {
		username = data.username;
		password = data.password;
		email = data.email;
		passwordConfirm = data.passwordConfirm;
	}
	res.render('register', {
		errors: req.flash('validationErrors'),
		username: username,
		password: password,
		email: email,
		passwordConfirm: passwordConfirm,
	});
};

exports.viewForgotPasswordPage = (req, res, next) => {
	res.status(200).render('forgotPassword');
};

exports.viewResetPasswordPage = (req, res, next) => {
	const token = req.params.token;
	console.log(token);
	res.status(200).render('resetPassword', {
		token,
	});
};
