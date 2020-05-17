const passport = require('passport');

module.exports = (app) => {
	app.get(
		'/auth/google', 
		passport.authenticate('google', {
			scope: ['profile', 'email']
		})
	);

	app.get(
		'/auth/google/callback', 
		passport.authenticate('google'),
		(req, res) => {
			res.redirect('/surveys');
		}
	);

	app.get(
		'/api/users/current',
		(req, res) => {
			res.send(req.user);
		}
	);

	app.post(
		'/api/users/logout',
		(req, res) => {
			req.logout();
			res.send(req.user);
		}
	);
};