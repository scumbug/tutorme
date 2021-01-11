// import libs
const multer = require('multer');
const fs = require('fs');

/**
 * Process file received from HTTP request.
 * @param {string} storage - Either 'memory' or 'disk'
 * @param {string} name - Specify a filename
 */
const init = (storage = 'memory') => {
	const engine =
		storage == 'disk'
			? multer.diskStorage({ destination: '/tmp/uploads' })
			: multer.memoryStorage();
	return multer({
		storage: engine, //store upload on RAM/disk
		limits: { fileSize: 5 * 1000 * 1000 }, //5MB limit
	});
};

const deleteLocal = (path) => {
	fs.unlink(path, () => {});
};
module.exports = { init, deleteLocal };
