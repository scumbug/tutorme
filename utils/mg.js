//import libs
const { MongoClient } = require('mongodb');

//
// Helper Functions
//

/**
 * Init mongo client
 * @summary eg: mongodb://localhost:27017
 * @param {string} URI
 */
const init = (URI) => {
	return new MongoClient(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

/**
 * check if Mongo is alive
 * @summary Promise.resolve() if successful, Promise.reject() when failed
 * @returns Promise
 */
const check = (mongo) => {
	return new Promise((resolve, reject) => {
		mongo
			.connect()
			.then((r) => {
				console.log('MongoDB is alive!');
				resolve();
			})
			.catch((e) => reject('Unable to connect to MongoDB'));
	});
};

/**
 * Get reviews and av ratings
 * @param {MongoClient} client
 * @param {string} db - MongoDB Database Name
 * @param {string} collection - MongoDB Collection Name
 */
const insertDoc = (client, db, collection) => {
	const closure = (doc) => {
		return client.db(db).collection(collection).insertOne(doc);
	};
	return closure;
};

module.exports = {
	init,
	check,
	insertDoc,
};
