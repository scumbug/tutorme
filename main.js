// import libs
const express = require('express');
const morgan = require('morgan');
const sql = require('./utils/sql');
const auth = require('./utils/auth');

require('dotenv').config();

// Declare port and constants
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
const SECRET = process.env.JWT_SECRET;
const ISSUER = process.env.APP_NAME;

// Init plugins
const db = sql.init();
auth.config(db, SECRET, ISSUER);

// Declare routes
const login = require('./api/login')(SECRET, ISSUER);
const users = require('./api/users')(db);
const lessons = require('./api/lessons')(db);
const subjects = require('./api/subjects')(db);

// Create app instance
const app = express();

// Init middleware
app.use(morgan('tiny'));
app.use(auth.init());

//
// Endpoints
//
app.use('/v1', login);
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
