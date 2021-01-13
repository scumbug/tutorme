const express = require('express');
const auth = require('../utils/auth');
const sql = require('../utils/sql');
const sha1 = require('sha1');

const SQL_GET_USERS = 'SELECT * FROM v_users WHERE role = 1';
const SQL_GET_USER = 'SELECT * FROM v_users WHERE id = ?';
const SQL_INSERT_USER = 'INSERT INTO users SET ?';
const SQL_UNIQ_USER = 'SELECT count(*) AS dup FROM v_users WHERE username = ?';
const SQL_UPDATE_USER = 'UPDATE users SET ? WHERE id = ?';
const SQL_DELETE_USER = 'DELETE FROM users WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();

	const getUsers = sql.mkQuery(SQL_GET_USERS, db);
	const getUser = sql.mkQuery(SQL_GET_USER, db);
	const insertUser = sql.mkQuery(SQL_INSERT_USER, db);
	const dupUserCheck = sql.mkQuery(SQL_UNIQ_USER, db);
	const updateUser = sql.mkQuery(SQL_UPDATE_USER, db);
	const deleteUser = sql.mkQuery(SQL_DELETE_USER, db);

	// GET retreive all users
	router.get('/users', auth.authenticate('jwt'), async (req, res) => {
		// Pull all users from db
		try {
			const result = await getUsers();
			if (!!result.length) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'No users in database!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});

	// POST add new user
	router.post(
		'/users',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			console.log(req.body);
			// Create new user
			let payload = req.body;
			payload.password = sha1(payload.password);
			delete payload.id;

			// Generate payload
			try {
				const [flag] = await dupUserCheck(payload.username);
				if (flag.dup > 0) {
					res.status(403).json({ message: 'Duplicated username!' });
				} else {
					const result = await insertUser(payload);
					res.status(200).json({ message: 'User created successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	// GET retreive single user
	router.get('/users/:id', auth.authenticate('jwt'), async (req, res) => {
		// Pull all users from db
		try {
			const result = await getUser([req.params.id]);
			if (!!result.length) {
				res.status(200).json(result[0]);
			} else res.status(404).json({ message: 'User not found!' });
		} catch (e) {
			res.status(500).json(e);
		}
	});

	// PUT update new user
	router.put(
		'/users/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			// Generate payload
			console.log(req.body);
			let payload = req.body;
			if (payload.password != '') payload.password = sha1(payload.password);
			else delete payload.password;

			try {
				res.status(200).json(await updateUser([payload, req.params.id]));
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	// DELETE user
	router.delete(
		'/users/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			try {
				await deleteUser(req.params.id);
				res.status(200).json({ message: 'User deleted successfully' });
			} catch (error) {
				res.status(500).json(e);
				console.log(e);
			}
		}
	);

	return router;
};
