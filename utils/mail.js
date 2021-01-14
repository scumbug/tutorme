// import libs
const mailgun = require('mailgun.js');

// declare constants
const DOMAIN = process.env.MAILGUN_DOMAIN;

// create client
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API,
});

const notifyTutee = (payload) => {};

module.exports = { notifyTutee };
