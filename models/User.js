<<<<<<< HEAD
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const crypto = require('crypto');

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Please provide username.'],
		unique: true,
		minlength: [2, 'Name must be longer than one character.'],
	},
	email: {
		type: String,
		required: [true, 'Please provide a email.'],
		lowercase: true,
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},

	image: {
		type: String, //PATH IN FILE SYSTEM WHERE IMAGE IS UPLOADED
		default: '/img/default-user-image.png',
	},
	role: {
		type: String,
		enum: [
			'neophyte',
			'admin',
			'Grill-Master',
			'Huck-Master',
			'Gutter-Punk',
			'Home-Owner',
			'Lewd-Dude',
			'Therapist',
			'Space-Cadet',
			'Purp-Skurp',
			'Creepy-Birder',
		],
		default: 'neophyte',
	},
	bio: {
		type: String,
		default: `Tell us about yourself...`,
	},
	passwordResetToken: String,
	passwordResetExpires: Date,
	passwordChangedAt: String,
	password: {
		type: String,
		required: [true, 'Please provide password.'],
		minlength: [2, 'Password must be longer than eight characters.'],
		select: false, //WILL NEVER SHOW UP IN ANY OUTPUT aka User.findOne() ETC
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// THIS ONLY OCCURS ON CREATE AND SAVE METHOD
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are not the same',
		},
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

UserSchema.plugin(uniqueValidator);

// THIS FUNCTION ONLY RUNS WHEN .CREATE or .SAVE INVOKED
UserSchema.pre('save', function (next) {
	const user = this;
	if (user.isModified('password')) {
		bcrypt.hash(user.password, 10, (error, hash) => {
			user.password = hash;
			this.passwordConfirm = undefined;
			this.passwordChangedAt = Date.now() - 1000; //PUT PROPERTY ONE SECOND IN THE PAST
			next();
		});
	} else {
		next();
	}
});

//QUERY HELPER
//DONT USE ARROW FUNCTIONS SO THAT THE THIS KEY APPLIES TO THE DOCUMENT
UserSchema.pre(/^find/, function (next) {
	// this points to the current QUERY
	this.find({ active: { $ne: false } });
	next();
});

//INSTANCE METHODS
//LOGIN METHOD COMPARING INPUT PASSWORD TO USER DATABASE
UserSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// MODIFYS THE DOCUMENT BUT DOES NOT SAVE
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	// console.log({ resetToken }, this.passwordResetToken);

	return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
=======
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Please provide username.'],
		unique: true,
		minlength: [2, 'Name must be longer than one character.'],
	},
	// email: {
	// 	type: String,
	// 	required: [true, 'Please provide an email'],
	// 	unique: true,
	// 	lowercase: true,
	// 	validate: [validator.isEmail, 'Please provide a valid email'],
	// },
	password: {
		type: String,
		required: [true, 'Please provide password.'],
		minlength: [2, 'Password must be longer than eight characters.'],
	},
	// passwordConfirm: {
	// 	type: String,
	// 	required: [true, 'Please confirm your password'],
	// 	validate: {
	// 		// Only works on CREATE and SAVE!!!
	// 		validator: function (el) {
	// 			return el === this.password;
	// 		},
	// 		message: 'Passwords are not the same',
	// 	},
	// },
	photo: {
		type: String, //PATH IN FILE SYSTEM WHERE IMAGE IS UPLOADED
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	bio: {
		type: String,
	},
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', async function (next) {
	const user = this;
	this.password = await bcrypt.hash(user.password, 10, (error, hash) => {
		user.password = hash;
		next();
	});
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
>>>>>>> 92a817e5f5772e1ef69b4615401b9b0c9a37138c
