const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

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
	password: {
		type: String,
		required: [true, 'Please provide password.'],
		minlength: [2, 'Password must be longer than eight characters.'],
	},
	image: {
		type: String, //PATH IN FILE SYSTEM WHERE IMAGE IS UPLOADED
		default: '/img/default-user-image.png',
	},
	role: {
		type: String,
		enum: ['Neophyte', 'admin'],
		default: 'Neophyte',
	},
	bio: {
		type: String,
		default: `Tell us about yourself...`,
	},
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
	const user = this;
	if (user.isModified('password')) {
		bcrypt.hash(user.password, 10, (error, hash) => {
			user.password = hash;
			next();
		});
	} else {
		next();
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
