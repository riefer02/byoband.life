<<<<<<< HEAD
const User = require('../models/User');

module.exports = (req, res, next) => {
	User.findById(req.session.userID, (error, user) => {
		if (error || !user) return res.redirect('/');
		next();
	});
};
=======
const User = require('../models/User');
module.exports = (req, res, next) => {
	User.findById(req.session.userID, (error, user) => {
		if (error || !user) return res.redirect('/');
		next();
	});
};
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
