const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');
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
		enum: ['Neophyte', 'admin'],
		default: 'Neophyte',
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
});

UserSchema.plugin(uniqueValidator);

// THIS FUNCTION ONLY RUNS WHEN .CREATE or .SAVE INVOKED
UserSchema.pre('save', function (next) {
	const user = this;
	if (user.isModified('password')) {
		bcrypt.hash(user.password, 10, (error, hash) => {
			user.password = hash;
			this.passwordConfirm = undefined;
			next();
		});
	} else {
		next();
	}
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

	console.log({ resetToken }, this.passwordResetToken);

	return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
