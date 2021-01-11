const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const sql = require('../utils/sql');
const sha1 = require('sha1');

const SQL_AUTHENTICATE =
	'SELECT count(*) as auth FROM users WHERE username = ? AND password = ?';

const config = async (db, SECRET, ISSUER) => {
	const getAuth = sql.mkQuery(SQL_AUTHENTICATE, db);

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
				const [res] = await getAuth([user, sha1(pwd)]);
				if (res.auth) {
					console.log('here');
					done(null, {
						username: user,
						logintime: new Date(),
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
