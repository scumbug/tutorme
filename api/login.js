const express = require('express');
const auth = require('../utils/auth');

module.exports = (SECRET, ISSUER) => {
	const router = express.Router();

	// Authenticate user/pass and generate token
	router.get(
		'/login',
		express.json(),
		auth.authenticate('local'),
		(req, res) => {
			const token = auth.makeJWT(req.user, ISSUER, SECRET);
			res.status(200).json({ message: 'ok', token: token });
		}
	);

	return router;
};
