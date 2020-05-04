const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');

const BlogPost = require('./models/BlogPost.js');
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const validateMiddleWare = require('./middleware/validationMiddleWare');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logoutController');
const blogRouter = require('./routes/blogRoutes.js');
const userRouter = require('./routes/userRoutes.js');

mongoose.connect(
	'mongodb+srv://riefer02:legacy21@byob-blog-1-c5qvl.mongodb.net/blog?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const app = new express();

app.set('view engine', 'ejs');
let port = process.env.Port;
if (port == null || port == '') port = 6969;
// global.loggedIn = null;

// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);
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

//MOUNTING ROUTES
app.use('/', blogRouter);
app.use('/', userRouter);

// ROUTES
app.get('/', homeController);
app.get('/post/:id', getPostController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, storePostController);

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post(
	'/users/register',
	redirectIfAuthenticatedMiddleware,
	storeUserController
);
app.post(
	'/users/login',
	redirectIfAuthenticatedMiddleware,
	loginUserController
);
app.get('/auth/logout', logoutController);
// app.use((req, res) => res.render('notfound'));

// SERVER
app.listen(port, () => {
	console.log(`App is listening on port ${port}...`);
});
