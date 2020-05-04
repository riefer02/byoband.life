const BlogPost = require('../models/BlogPost.js');

// Populate all Blogposts on Home Page
exports.viewHomePage = async (req, res, next) => {
	const blogposts = await BlogPost.find({}).populate('userid');
	res.status(200).render('index', {
		blogposts,
	});
};

// To Login Page
exports.viewLoginPage = (req, res, next) => {
	res.render('login');
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
exports.viewUserProfile = (req, res, next) => {
	res.status(200).render('profile');
};

//Go to register New User Page
exports.viewRegisterPage = (req, res, next) => {
	var username = '';
	var password = '';
	// var email = '';
	// var passwordConfirm = '';
	const data = req.flash('data')[0];
	if (typeof data != 'undefined') {
		username = data.username;
		password = data.password;
		// email = data.email;
		// passwordConfirm = data.passwordConfirm;
	}
	res.render('register', {
		// errors: req.session.validationErrors,
		errors: req.flash('validationErrors'),
		username: username,
		password: password,
		// email: email,
		// passwordConfirm: passwordConfirm,
	});
};
