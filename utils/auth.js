const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const sql = require('../utils/sql');

const SQL_AUTHENTICATE =
	'SELECT count(*) as auth FROM users WHERE username = ? AND password = sha1(?)';
const SQL_PERMISSION = 'SELECT role,id FROM users WHERE username = ?';

const config = async (db, SECRET, ISSUER) => {
	const getAuth = sql.mkQuery(SQL_AUTHENTICATE, db);
	const getPermission = sql.mkQuery(SQL_PERMISSION, db);

	// Declare JWT auth strat
	let opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: SECRET,
		issuer: ISSUER,
	};
	passport.use(
		new JWTStrategy(opts, function (jwt_payload, done) {
			return done(null, jwt_payload);
		})
	);

	// Declare local auth strat
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'username',
				passwordField: 'password',
			},
			async (user, pwd, done) => {
				//do auth here
				const [flag] = await getAuth([user, pwd]);
				if (flag.auth) {
					const [result] = await getPermission([user]);
					done(null, {
						username: user,
						logintime: new Date(),
						role: result.role,
						id: result.id,
					});
				} else done('salah logins', false);
			}
		)
	);
};

const makeJWT = (user, issuer, secret) => {
	return jwt.sign(
		{
			sub: user, // subject
			iss: issuer, // issuer
			iat: new Date().getTime() / 1000, // issue time
			exp: new Date().getTime() / 1000 + 10000000, // token expiry in seconds
		},
		secret
	);
};

const authenticate = (strat, params = { session: false }) => {
	return passport.authenticate(strat, params);
};

const init = () => {
	return passport.initialize();
};

module.exports = { config, makeJWT, authenticate, init };
