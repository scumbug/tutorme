const express = require('express');
const auth = require('../utils/auth');
const sql = require('../utils/sql');

const SQL_GET_USERS = 'SELECT * FROM v_users';

module.exports = (db) => {
	const router = express.Router();

	const getUsers = sql.mkQuery(SQL_GET_USERS, db);

	router.get('/users', auth.authenticate('jwt'), async (req, res) => {
		// TODO
		// Pull all users from db
		const result = await getUsers();
		console.log(result);
		res.status(200);
		res.json({ message: 'ok' });
	});

	router.get('/users/:id', auth.authenticate('jwt'), (req, res) => {
		// TODO
		// Pull specific user
		res.status(200);
		res.json({ message: 'ok' });
	});

	router.post(
		'/users/create',
		express.json(),
		auth.authenticate('jwt'),
		(req, res) => {
			// TODO
			// Create new user
		}
	);

	router.put(
		'/users/:id',
		express.json(),
		auth.authenticate('jwt'),
		(req, res) => {
			// TODO
			// Update new user
		}
	);

	return router;
};
