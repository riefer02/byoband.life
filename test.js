const mongoose = require('mongoose');

const BlogPost = require('./models/BlogPost');

mongoose.connect(
	'mongodb+srv://riefer02:legacy21@byob-blog-1-c5qvl.mongodb.net/blog?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

BlogPost.create(
	{
		title: 'The Day I Learned to Breathe',
		body:
			'A long time ago, I lived my life in fear. I thought everyday was the last if I just stayed inside. So eventually I broke out and headed for the world. It was a long road and I was scared a few times, but with a little help from my friends I made it home in one piece.',
	},
	(error, blogpost) => {
		console.log(error, blogpost);
	}
);
