// import libs
const express = require('express');
const morgan = require('morgan');
const sql = require('./utils/sql');
require('dotenv').config();

// Declare port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// Init plugins
const db = sql.init();

// Declare routes
const auth = require('./api/auth')(db, '/v1');
const users = require('./api/users');
const lessons = require('./api/lessons');
const subjects = require('./api/subjects');

// Create app instance
const app = express();

// Init middleware
app.use(morgan('tiny'));

//
// Endpoints
//
app.use('/v1', auth);
app.use('/v1', users);
app.use('/v1', lessons);
app.use('/v1', subjects);

// Start server
Promise.all([sql.check(db)])
	.then(() => {
		app.listen(
			PORT,
			console.log(`App has started on ${PORT} at ${new Date()}`)
		);
	})
	.catch((e) => console.log(e));
