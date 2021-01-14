// import libs
const express = require('express');
const sql = require('../utils/sql');
const auth = require('../utils/auth');
const aws = require('../utils/s3');
const mult = require('../utils/multer');

const SQL_GET_QUESTIONS = 'SELECT * FROM questions';
const SQL_SET_QUESTIONS = 'INSERT INTO questions SET ?';

module.exports = (db, s3) => {
	const router = express.Router();

	const getQuestions = sql.mkQuery(SQL_GET_QUESTIONS, db);
	const addQuestions = sql.mkQuery(SQL_SET_QUESTIONS, db);

	const upload = mult.init('disk');
	const pushS3 = aws.upload(process.env.BUCKET, s3);

	router.get('/questions', auth.authenticate('jwt'), async (req, res) => {
		try {
			const result = await getQuestions();
			res.status(200).json(result);
		} catch (e) {
			res.status(500).json(e);
		}
	});

	router.post(
		'/questions',
		auth.authenticate('jwt'),
		upload.single('upload'),
		async (req, res) => {
			try {
				const form = JSON.parse(req.body.form);
				//do upload here
				const key = await pushS3(req.file);
				const record = {
					name: form.name,
					url: `http://${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`,
				};
				const result = await addQuestions(record);
				await mult.deleteLocal(req.file.path);
				res.status(200).json(result);
			} catch (e) {
				res.status(500).json(e);
			}
		}
	);
	return router;
};
