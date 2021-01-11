const express = require('express');
const auth = require('../utils/auth');
const sql = require('../utils/sql');
const sha1 = require('sha1');

const SQL_GET_USERS = 'SELECT * FROM v_users';
const SQL_GET_USER = 'SELECT * FROM v_users WHERE id = ?';
const SQL_INSERT_USER = 'INSERT INTO users SET ?';
const SQL_UNIQ_USER = 'SELECT count(*) AS dup FROM v_users WHERE username = ?';
const SQL_UPDATE_USER = 'UPDATE users SET ? WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();

	const getUsers = sql.mkQuery(SQL_GET_USERS, db);
	const getUser = sql.mkQuery(SQL_GET_USER, db);
	const insertUser = sql.mkQuery(SQL_INSERT_USER, db);
	const dupUserCheck = sql.mkQuery(SQL_UNIQ_USER, db);
	const updateUser = sql.mkQuery(SQL_UPDATE_USER, db);

	router.get('/users', auth.authenticate('jwt'), async (req, res) => {
		// Pull all users from db
		try {
			const result = await getUsers();
			if (!!result.length) {
				res.status(200).json(await getUsers());
			} else {
				res.status(404).json({ message: 'No users in database!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});

	router.get('/users/:id', auth.authenticate('jwt'), async (req, res) => {
		// Pull all users from db
		try {
			const result = await getUser([req.params.id]);
			if (!!result.length) {
				res.status(200).json(await getUser([req.params.id]));
			} else res.status(404).json({ message: 'User not found!' });
		} catch (e) {
			res.status(500).json(e);
		}
	});

	router.post(
		'/users/create',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			// Create new user
			let payload = req.body;
			payload.password = sha1(payload.password);
			console.log(payload);

			// Generate payload
			try {
				const [flag] = await dupUserCheck(payload.username);
				console.log(flag);
				if (flag.dup > 0) {
					res.status(403).json({ message: 'Duplicated username!' });
				} else {
					const result = await insertUser(payload);
					console.log(result);
					res.status(200).json({ message: 'User created successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	router.put(
		'/users/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			// TODO
			// Update new user

			// Generate payload
			let payload = req.body;
			payload.password = sha1(payload.password);
			console.log(payload);

			try {
				res.status(200).json(await updateUser([payload, req.params.id]));
				res.end();
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	return router;
};
