<<<<<<< HEAD
module.exports = (req, res, next) => {
	if (req.session.userID) {
		return res.redirect('/');
	}
	next();
};
=======
module.exports = (req, res, next) => {
	if (req.session.userID) {
		return res.redirect('/');
	}
	next();
};
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
