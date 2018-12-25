var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var	crypto = require('crypto');

var userSchema = new Schema({
	username: {
		type: String,
		trim: true,
		unqiue: true
	},
	password: {
		type: String
	},
	role: {
		type: String,
		enum: ['admin', 'custom'],
		default: 'custom'
	},
	salt: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

userSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

userSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

userSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		email: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

userSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('User', userSchema);