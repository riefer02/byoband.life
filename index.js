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

dotenv.config({ path: './config.env' });

const app = new express();

let port = process.env.Port || 6969;
if (port == null || port == '') port = 6969;
// global.loggedIn = null;

console.log(process.env);

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

// SERVER
app.listen(port, () => {
	console.log(`App is listening on port ${port}...`);
});

setTimeout(() => {
	console.log(process.env);
}, 2000);
console.log(process.env);
