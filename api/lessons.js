const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');

const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');
const { set } = require('date-fns');

const mailgun = require('mailgun.js');

const SQL_GET_LESSONS = 'SELECT * FROM schedule WHERE (start BETWEEN ? AND ?)';
const SQL_GET_STUDENT_LESSONS =
	'SELECT title as description, description as title, start, end, lid, uid, sid FROM schedule WHERE (start BETWEEN ? AND ?) AND uid = ?';
const SQL_GET_LESSON = 'SELECT * FROM schedule WHERE id = ?';
const SQL_UNIQ_LESSON = `SELECT start, end FROM lessons WHERE start BETWEEN ? AND ?`;
const SQL_INSERT_LESSON = 'INSERT INTO lessons SET ?';
const SQL_UPDATE_LESSON = 'UPDATE lessons SET ? WHERE id = ?';
const SQL_DELETE_LESSON = 'DELETE FROM lessons WHERE id = ?';
const SQL_GET_SUBJECT_NAME = 'SELECT name FROM subjects WHERE id = ?';

module.exports = (db) => {
	const router = express.Router();
	const mg = mailgun.client({
		username: 'api',
		key: process.env.MAILGUN_API,
	});

	const getLessons = sql.mkQuery(SQL_GET_LESSONS, db);
	const getStudentLessons = sql.mkQuery(SQL_GET_STUDENT_LESSONS, db);
	const getLesson = sql.mkQuery(SQL_GET_LESSON, db);
	const lessonClash = sql.mkQuery(SQL_UNIQ_LESSON, db);
	const insertLesson = sql.mkQuery(SQL_INSERT_LESSON, db);
	const updateLesson = sql.mkQuery(SQL_UPDATE_LESSON, db);
	const deleteLesson = sql.mkQuery(SQL_DELETE_LESSON, db);
	const getSubjectName = sql.mkQuery(SQL_GET_SUBJECT_NAME, db);

	router.get('/testmail', async (req, res) => {
		mg.messages
			.create(process.env.MAILGUN_DOMAIN, {
				from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
				to: ['chunsiang10@gmail.com'],
				subject: 'Hello',
				text: 'Testing some Mailgun awesomness!',
				html: '<h1>Testing some Mailgun awesomness!</h1>',
			})
			.then((msg) => {
				console.log(msg);
				res.status(200).json({ message: 'test' });
			})
			.catch((err) => console.log(err));
	});

	// GET all lessons
	router.get('/lessons', auth.authenticate('jwt'), async (req, res) => {
		try {
			let result = null;
			if (req.query.id == 'null')
				result = await getLessons([req.query.start, req.query.end]);
			else
				result = await getStudentLessons([
					req.query.start,
					req.query.end,
					req.query.id,
				]);

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

					const [subjectName] = await getSubjectName([req.body.title]);

					// to be destructured
					await mg.messages.create(process.env.MAILGUN_DOMAIN, {
						from: `TutorMe <mailgun@${process.env.MAILGUN_DOMAIN}>`,
						to: ['chunsiang10@gmail.com'],
						subject: 'New Lesson Scheduled',
						text: `You have a new lesson scheduled, here are the details \n
							${subjectName.name} \n
							Start: ${start}
							End: ${end}
							`,
						html: `<h1><p>You have a new lesson scheduled</p></h1>
							<h2> Subject: ${subjectName.name}</h2> 
							<h3>Start: ${start}</h3>
							<h3>End: ${end}</h3>`,
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
