const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth')

const SQL_GET_SUBJECTS = 'SELECT * FROM subjects';
const SQL_GET_SUBJECT = 'SELECT * FROM subjects WHERE id = ?';
const SQL_UNIQ_SUBJECT = 'SELECT count(*) AS dup FROM subject WHERE name = ?';
const SQL_INSERT_SUBJECT = 'INSERT INTO subject SET ?';
const SQL_UPDATE_SUBJECT = 'UPDATE subject SET ?';

module.exports = (db) => {
	const router = express.Router();

	const getSubjects = sql.mkQuery(SQL_GET_SUBJECTS, db);
	const getSubject = sql.mkQuery(SQL_GET_SUBJECT,db)
	const dupSubCheck = sql.mkQuery(SQL_UNIQ_SUBJECT,db)
	const insertSubject = sql.mkQuery(SQL_INSERT_SUBJECT,db)
	const updateSubject = sql.mkQuery(SQL_UPDATE_SUBJECT,db)

	// GET all subjects
	router.get('/subjects', auth.authenticate('jwt'), (req, res) => {
		try {
			const result = await getSubjects();
			if (!!result.length) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'No subjects in database!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});

	// GET one subject
	router.get('/subjects/:id', auth.authenticate('jwt'), (req, res) => {
		try {
			const result = await getSubject([req.params.id]);
			if (!!result.length) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'Subject not found!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});


	// POST create new subject
	router.post(
		'/subjects',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			// Create new user
			try {
				const [flag] = await dupSubCheck(req.body.name);
				if (flag.dup > 0) {
					res.status(403).json({ message: 'Duplicated subject!' });
				} else {
					const result = await insertSubject(req.body);
					res.status(200).json({ message: 'Subject created successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	// PUT update subject
	router.put(
		'/users/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			try {
				res.status(200).json(await updateSubject([req.body, req.params.id]));
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	return router;
};
