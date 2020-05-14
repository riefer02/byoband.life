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

// INIT APP
const app = express();

// GLOBAL VARIABLES

// PORT
let port = process.env.PORT || 6969;
if (port === null || port === '') port = 6969;

// FUNCTION THAT PINGS HEROKU DYNO TO NOT GO IDLE
keepAppAlive();

// CONNECTION TO DATABASE
mongoose
	.connect(
		process.env.MONGODB_URI ||
			'mongodb+srv://riefer02:legacy21@byob-blog-1-c5qvl.mongodb.net/blog?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then((con) => {
		console.log(`DB connection successful`);
	});

// VIEW TEMPLATE ENGINE 'EJS' INIT
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

// CATCH ALL ROUTE
app.use((req, res) => res.render('notfound'));

// SERVER
app.listen(port, () => {
	console.log(`App is listening on port ${port}...`);
});

// module.exports = app;
