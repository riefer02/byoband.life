const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');

const blogRouter = require('./routes/blogRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');
const keepAppAlive = require('./utils/keepAppAlive');

dotenv.config({ path: './config.env' });

const app = express();

let port = process.env.PORT || 6969;
if (port === null || port === '') port = 6969;

keepAppAlive();

mongoose
	.connect(
		process.env.MONGODB_URI ||
			'mongodb+srv://riefer02:legacy21@byob-blog-1-c5qvl.mongodb.net/blog?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then((con) => {
		console.log(`DB connection successful`);
	});

app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
	expressSession({
		secret: 'dayzee',
	})
);
app.use('*', (req, res, next) => {
	loggedIn = req.session.userID;
	next();
});
app.use(flash());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// MOUNTING ROUTES
app.use('/', viewRouter);
app.use('/posts', blogRouter);
app.use('/users', userRouter);

app.use((req, res) => res.render('notfound'));

// app.all('*', (req, res, next) => {
// 	// const err = new Error(`can't find the ${req.originalUrl} on this server!`);
// 	// err.status = 'fail';
// 	// err.statusCode = 404;
// 	// next(err); // PASSING ANYTHING INTO NEXT WILL BE ASSUMED TO BE AN ERROR AND BE PASSED TO GLOBAL ERROR HANDLING MIDDLEWARE
// });

// // FOUR ARGUMENTS LET EXPRESS KNOW ITS AN ERROR HANDLING MIDDLEWARE
// app.use((err, req, res, next) => {
// 	console.error(err.stack);
// 	err.statusCode = err.statusCode || 500;
// 	err.status = err.status || 'error';

// res.status(err.status).json({
// 	status: err.status,
// 	message: err.message,
// });
// });

// SERVER
app.listen(port, () => {
	console.log(`App is listening on port ${port}...`);
});

// module.exports = app;
