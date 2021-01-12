const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');

const parseISO = require('date-fns/parseISO');
const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');

const SQL_GET_LESSONS = 'SELECT * FROM lessons';
const SQL_GET_LESSON = 'SELECT * FROM lessons WHERE id = ?';
const SQL_UNIQ_LESSON = `SELECT start, end FROM lessons WHERE (tutor = ? OR tutee = ?) AND (start BETWEEN ? AND ?)`;
const SQL_INSERT_LESSON = 'INSERT INTO lessons SET ?';
const SQL_UPDATE_LESSON = 'UPDATE lessons SET ? WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();

	const getLessons = sql.mkQuery(SQL_GET_LESSONS, db);
	const getLesson = sql.mkQuery(SQL_GET_LESSON, db);
	const lessonClash = sql.mkQuery(SQL_UNIQ_LESSON, db);
	const insertLesson = sql.mkQuery(SQL_INSERT_LESSON, db);
	const updateLesson = sql.mkQuery(SQL_UPDATE_LESSON, db);

	// GET all lessons
	router.get('/lessons', auth.authenticate('jwt'), async (req, res) => {
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
	router.get('/lessons/:id', auth.authenticate('jwt'), async (req, res) => {
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
				const result = await lessonClash([
					req.body.tutor,
					req.body.tutee,
					parseISO(req.body.start),
					parseISO(req.body.end),
				]);

				if (clashCheck(req.body.start, req.body.end, result)) {
					res.status(403).json({ message: 'There is already a lesson!' });
				} else {
					await insertLesson({
						subject: req.body.subject,
						tutor: req.body.tutor,
						tutee: req.body.tutee,
						start: parseISO(req.body.start),
						end: parseISO(req.body.end),
						paid: req.body.paid,
					});
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
				const result = await lessonClash([
					req.body.tutor,
					req.body.tutee,
					parseISO(req.body.start),
					parseISO(req.body.end),
				]);

				if (clashCheck(req.body.start, req.body.end, result)) {
					res.status(403).json({ message: 'There is already a lesson!' });
				} else {
					await updateLesson([
						{
							subject: req.body.subject,
							tutor: req.body.tutor,
							tutee: req.body.tutee,
							start: parseISO(req.body.start),
							end: parseISO(req.body.end),
							paid: req.body.paid,
						},
						req.params.id,
					]);
					res.status(200).json({ message: 'Lesson updated successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);

	return router;
};

const clashCheck = (pending_start, pending_end, intervals) => {
	for (interval of intervals) {
		if (
			areIntervalsOverlapping(
				{ start: parseISO(pending_start), end: parseISO(pending_end) },
				interval
			)
		) {
			return true;
		}
	}
	return false;
};
