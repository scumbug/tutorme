const express = require('express');

module.exports = () => {
	const router = express.Router();

	router.get('/lessons', (req, res) => {
		res.status(200);
		res.json({ message: 'ok' });
	});

	return router;
};
