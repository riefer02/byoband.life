const BlogPost = require('../models/BlogPost.js');

module.exports = async (req, res, next) => {
	const blogposts = await BlogPost.find({}).populate('userid');
	res.status(200).render('index', {
		blogposts,
	});
};

// .json({
// 	"status": "success",
// 	"message": "You have successfully reached your API sir.";
// })
