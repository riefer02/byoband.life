module.exports = (req, res, next) => {
	if (
		req.files == null ||
		req.files === '' ||
		req.body.title == null ||
		req.body.title === '' ||
		req.body.body === '' ||
		req.body.body == null
	) {
		console.log('hello');
		req.flash('data', req.body);

		const msg =
			'Please enter a title, body of text, and a image for your post.';

		let title = '';
		let body = '';
		let image = '';

		const data = req.flash('data')[0];

		if (typeof data !== 'undefined') {
			title = data.title;
			body = data.body;
			image = data.image;
		}

		console.log(title, body, image);

		return res.render('create', {
			msg,
			title: title,
			body: body,
			image: image,
			createPost: true,
		});
	}
	next();
};
