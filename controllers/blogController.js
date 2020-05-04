const BlogPost = require('./../models/BlogPost.js');

exports.getBlogPosts = async (req, res) => {
	const blogposts = await BlogPost.find({});

	res.header('application/json');
	res.status(404).json({
		message: 'Here are your blogs sir.',
		data: {
			blogposts,
		},
	});
};
