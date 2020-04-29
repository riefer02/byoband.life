const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Please provide username.'],
		unique: true,
		minlength: [2, 'Name must be longer than one character.'],
	},
	password: {
		type: String,
		required: [true, 'Please provide password.'],
		minlength: [2, 'Password must be longer than eight characters.'],
	},
});
UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
	const user = this;
	bcrypt.hash(user.password, 10, (error, hash) => {
		user.password = hash;
		next();
	});
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
