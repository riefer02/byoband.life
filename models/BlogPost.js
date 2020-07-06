<<<<<<< HEAD
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
	title: String,
	body: String,
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	datePosted: {
		type: Date,
		default: new Date(),
	},
	image: String,
	rating: {
		type: Number,
		default: 0,
	},
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
=======
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
	title: String,
	body: String,
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	datePosted: {
		type: Date,
		default: new Date(),
	},
	image: String,
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
