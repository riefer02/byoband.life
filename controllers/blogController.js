<<<<<<< HEAD
const path = require('path');
const multer = require('multer');

const fileUpload = require('express-fileupload');
const BlogPost = require('../models/BlogPost.js');

const upload = multer({ dest: 'public/img' });

//Returns JSON of Blogs from DB
exports.getBlogPosts = async (req, res, next) => {
	const blogposts = await BlogPost.find({});

	res.header('application/json');
	res.status(404).json({
		message: 'Here are your blogs sir.',
		data: {
			blogposts,
		},
	});
};

//Renders Individual Blog Page
exports.getBlogPostById = async (req, res, next) => {
	const blogpost = await BlogPost.findById(req.params.id).populate('userid');
	res.render('post', {
		blogpost,
	});
};

exports.createBlogPost = (req, res, next) => {
	try {
		const { image } = req.files;
		image.mv(
			path.resolve(__dirname, '..', 'public/img', image.name),
			async (error) => {
				await BlogPost.create({
					...req.body,
					image: '/img/' + image.name,
					userid: req.session.userID,
				});
				res.redirect('/');
			}
		);
	} catch (error) {
		console.log(error);
	}
};

exports.likeBlogPost = async (req, res, next) => {
	await BlogPost.findByIdAndUpdate(
		req.params.id,
		{ $inc: { rating: 1 } },
		{ new: true }
	);
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.end();
};

