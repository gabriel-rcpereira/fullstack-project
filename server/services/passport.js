const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((userFound) => {
			done(null, userFound);
		});
});

passport.use(
	new GoogleStrategy({
		clientID: keys.googleClientID,
		clientSecret: keys.googleClientSecret,
		callbackURL: '/auth/google/callback'
	}, 
	async (acessToken, refreshToken, profile, done) => {
		const user = { googleId: profile.id };
		let userFromDb = await User.findOne(user);    

		if (!userFromDb) {
			userFromDb = await new User(user).save();
		}

		done(null, userFromDb);
	})
);