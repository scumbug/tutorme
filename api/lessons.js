const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');

const dayjs = require('dayjs')

const SQL_GET_LESSONS = 'SELECT * FROM lessons';
const SQL_GET_LESSON = 'SELECT * FROM lessons WHERE id = ?';
const SQL_UNIQ_LESSON = 'SELECT start, end FROM lessons WHERE (tutor = ? OR tutee = ?) AND start LIKE ?%';
const SQL_INSERT_LESSON = 'INSERT INTO lessons SET ?';
const SQL_UPDATE_LESSON = 'UPDATE lessons SET ?';

const clashCheck = (pending_start, pending_end, start, end) => {
	return dayjs(pending_start).isBefore(end) && dayjs(pending_end).isAfter(start);
};

module.exports = () => {
	const router = express.Router();

	const getLessons = sql.mkQuery(SQL_GET_LESSONS, db);
	const getLesson = sql.mkQuery(SQL_GET_LESSON, db);
	const lessonClash = sql.mkQuery(SQL_UNIQ_LESSON, db);
	const insertLesson = sql.mkQuery(SQL_INSERT_LESSON, db);
	const updateLesson = sql.mkQuery(SQL_UPDATE_LESSON, db);

	// GET all lessons
	router.get('/lessons', auth.authenticate('jwt'), (req, res) => {
		try {
			const result = await getLessons();
			if (!!result.length) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'No lessons in database!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});

	// GET one lesson
	router.get('/lessons/:id', auth.authenticate('jwt'), (req, res) => {
		try {
			const result = await getLesson([req.params.id]);
			if (!!result.length) {
				res.status(200).json(result);
			} else {
				res.status(404).json({ message: 'Lesson not found!' });
			}
		} catch (e) {
			res.status(500).json(e);
		}
	});


	// POST create new subject
	router.post(
		'/lessons',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			// Create new user
			try {
				// TODO
				// implement timing clashes, test this!
				const [result] = await lessonClash([req.body.tutor,req.body.tutee,dayjs().format('YYYY-MM-DD')]);
				console.log(result);
				if (flag.dup > 0) {
					res.status(403).json({ message: 'There is already a lesson!' });
				} else {
					const result = await insertLesson(req.body);
					res.status(200).json({ message: 'Lesson created successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	// PUT update subject
	router.put(
		'/lessons/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			try {
				// TODO
				// check timing clashes
				res.status(200).json(await updateLesson([req.body, req.params.id]));
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	return router;
};
