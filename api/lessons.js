const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');

const parseISO = require('date-fns/parseISO');
const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');
const { parse, set } = require('date-fns');

const SQL_GET_LESSONS = 'SELECT * FROM schedule WHERE start BETWEEN ? AND ?';
const SQL_GET_LESSON = 'SELECT * FROM schedule WHERE id = ?';
const SQL_UNIQ_LESSON = `SELECT start, end FROM lessons WHERE start BETWEEN ? AND ?`;
const SQL_INSERT_LESSON = 'INSERT INTO lessons SET ?';
const SQL_UPDATE_LESSON = 'UPDATE lessons SET ? WHERE id = ?';
const SQL_DELETE_LESSON = 'DELETE FROM lessons WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();

	const getLessons = sql.mkQuery(SQL_GET_LESSONS, db);
	const getLesson = sql.mkQuery(SQL_GET_LESSON, db);
	const lessonClash = sql.mkQuery(SQL_UNIQ_LESSON, db);
	const insertLesson = sql.mkQuery(SQL_INSERT_LESSON, db);
	const updateLesson = sql.mkQuery(SQL_UPDATE_LESSON, db);
	const deleteLesson = sql.mkQuery(SQL_DELETE_LESSON, db);

	// GET all lessons
	router.get('/lessons', auth.authenticate('jwt'), async (req, res) => {
		try {
			const result = await getLessons([req.query.start, req.query.end]);
			if (!!result.length) {
				// TODO
				// implement morphing of result to conform to fullcalendar format
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
				// morph body to conform with mysql table
				// build start time
				const start = set(new Date(req.body.date), {
					hours: req.body.startTime.hour,
					minutes: req.body.startTime.minute,
				});
				// build end time
				const end = set(new Date(req.body.date), {
					hours: req.body.endTime.hour,
					minutes: req.body.endTime.minute,
				});

				const result = await lessonClash([start, end]);

				if (clashCheck(start, end, result)) {
					res.status(403).json({ message: 'There is already a lesson!' });
				} else {
					await insertLesson({
						subject: req.body.title,
						tutee: req.body.tutee,
						start: start,
						end: end,
					});
					res.status(200).json({ message: 'Lesson created successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
				console.log(e);
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
				// morph body to conform with mysql table
				// build start time
				const start = set(new Date(req.body.date), {
					hours: req.body.startTime.hour,
					minutes: req.body.startTime.minute,
				});
				// build end time
				const end = set(new Date(req.body.date), {
					hours: req.body.endTime.hour,
					minutes: req.body.endTime.minute,
				});

				const result = await lessonClash([start, end]);

				console.log(req.body);

				if (clashCheck(start, end, result) && req.body.id != req.params.id) {
					res.status(403).json({ message: 'There is already a lesson!' });
				} else {
					await updateLesson([
						{
							subject: req.body.title,
							tutee: req.body.tutee,
							start: start,
							end: end,
						},
						req.params.id,
					]);
					res.status(200).json({ message: 'Lesson updated successfully' });
				}
			} catch (e) {
				res.status(500).json(e);
				console.log(e);
			}
		}
	);

	// DELETE lesson
	router.delete(
		'/lessons/:id',
		express.json(),
		auth.authenticate('jwt'),
		async (req, res) => {
			try {
				await deleteLesson(req.params.id);
				res.status(200).json({ message: 'Lesson deleted successfully' });
			} catch (error) {
				res.status(500).json(e);
				console.log(e);
			}
		}
	);

	return router;
};

const clashCheck = (pending_start, pending_end, intervals) => {
	for (interval of intervals) {
		if (
			areIntervalsOverlapping(
				{ start: pending_start, end: pending_end },
				interval
			)
		) {
			return true;
		}
	}
	return false;
};
