const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const blogRouter = require('./routes/blogRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');
const storeRouter = require('./routes/storeRoutes.js');
const storeController = require('./controllers/storeController');
const keepAppAlive = require('./utils/keepAppAlive');

dotenv.config({ path: './config.env' });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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
// SET SECURITY HTTP HEADERS
app.use(helmet());

// ATTEMPING TO FIX MOBILE PHONE ISSUE WITH AXIOS RESPONSE/ EVENT LISTENER /////////
// app.use(function (req, res, next) {
// 	res.header('Access-Control-Allow-Origin', 'https://www.byoband.life'); // update to match the domain you will make the request from
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept'
// 	);
// 	next();
// });

// LIMIT REQUESTS TO PROJECT AGAINST BRUTE FORCE ATTACK
const limiter = rateLimit({
	max: 500,
	windowMs: 60 * 60 * 1000, // 60 minutes
	message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter);

app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	storeController.webhookCheckout
);

app.use(express.static('public'));

// BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
	hpp({
		whitelist: ['rating', 'username'],
	})
);

// FILE UPLOAD SYSTEM
app.use(fileUpload());

// USER SESSION MANAGEMENT SYSTEM
app.use(
	expressSession({
		secret: 'dayzee',
	})
);
app.use('*', (req, res, next) => {
	loggedIn = req.session.userID;
	next();
});
app.use(flash({ locals: 'flash' }));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// MOUNTING ROUTES
app.use('/', viewRouter);
app.use('/posts', blogRouter);
app.use('/users', userRouter);
app.use('/store', storeRouter);

// CATCH ALL ROUTE
app.use((req, res) => res.render('notfound'));

// SERVER
app.listen(port, () => {
	console.log(`App is listening on port ${port}...`);
});

// module.exports = app;
