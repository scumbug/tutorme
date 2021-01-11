const express = require('express');
const auth = require('../utils/auth');

module.exports = () => {
	const router = express.Router();

	router.get('/users', auth.authenticate('jwt'), (req, res) => {
		res.status(200);
		res.json({ message: 'ok' });
	});

	return router;
};
