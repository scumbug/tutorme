const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');

const SQL_GET_SUBJECTS = 'SELECT * FROM subjects';
const SQL_GET_SUBJECT = 'SELECT * FROM subjects WHERE id = ?';
const SQL_UNIQ_SUBJECT = 'SELECT count(*) AS dup FROM subjects WHERE name = ?';
const SQL_INSERT_SUBJECT = 'INSERT INTO subjects SET ?';
const SQL_UPDATE_SUBJECT = 'UPDATE subjects SET ? WHERE id = ?';
const SQL_DELETE_SUBJECT = 'DELETE FROM subjects WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();

	const getSubjects = sql.mkQuery(SQL_GET_SUBJECTS, db);
	const getSubject = sql.mkQuery(SQL_GET_SUBJECT, db);
	const dupSubCheck = sql.mkQuery(SQL_UNIQ_SUBJECT, db);
	const insertSubject = sql.mkQuery(SQL_INSERT_SUBJECT, db);
	const updateSubject = sql.mkQuery(SQL_UPDATE_SUBJECT, db);
	const deleteSubject = sql.mkQuery(SQL_DELETE_SUBJECT, db);

	// GET all subjects
	router.get('/subjects', auth.authenticate('jwt'), async (req, res) => {
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
	router.get('/subjects/:id', auth.authenticate('jwt'), async (req, res) => {
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
				if (req.body.id == '') delete req.body.id; // clean up JSON for new subject
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
		'/subjects/:id',
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

	// DELETE subject
	router.delete(
		'/subjects/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			try {
				await deleteSubject(req.params.id);
				res.status(200).json({ message: 'Lesson deleted successfully' });
			} catch (error) {
				res.status(500).json(e);
				console.log(e);
			}
		}
	);

	return router;
};
