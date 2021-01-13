const express = require('express');
const auth = require('../utils/auth');

module.exports = (SECRET, ISSUER) => {
	const router = express.Router();

	// Authenticate user/pass and generate token
	router.post(
		'/login',
		express.json(),
		auth.authenticate('local'),
		(req, res) => {
			const token = auth.makeJWT(req.user.username, ISSUER, SECRET);
			res
				.status(200)
				.json({
					message: 'ok',
					token: token,
					role: req.user.role,
					id: req.user.id,
				});
		}
	);

	return router;
};
